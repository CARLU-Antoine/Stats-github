<?php

namespace App\Controller;

use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Exception\InvalidStateException;
use League\OAuth2\Client\Provider\GithubResourceOwner;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GithubController extends AbstractController
{
    public function connect(ClientRegistry $clientRegistry): Response
    {
        // Redirige vers GitHub pour autorisation OAuth
        return $clientRegistry->getClient('github')->redirect([], []);
    }

    public function connectCheck(
        Request $request,
        ClientRegistry $clientRegistry,
        HttpClientInterface $httpClient
    ): Response {
        $client = $clientRegistry->getClient('github');

        try {
            // Récupère le token d’accès via le code OAuth reçu automatiquement
            $accessToken = $client->getAccessToken();
            // Récupère l’utilisateur GitHub
            /** @var GithubResourceOwner $user */
            $user = $client->fetchUserFromToken($accessToken);
        } catch (InvalidStateException $e) {
            $this->addFlash('error', 'La connexion a expiré, veuillez réessayer.');
            return $this->redirectToRoute('connect_github');
        } catch (\Exception $e) {
            // Gestion générique des erreurs OAuth
            $this->addFlash('error', 'Erreur lors de la connexion GitHub : ' . $e->getMessage());
            return $this->redirectToRoute('connect_github');
        }

        $token = $accessToken->getToken();
        $githubUsername = $user->getNickname();

        // Requête vers l'API GitHub avec le token
        $response = $httpClient->request('GET', 'https://api.github.com/user/repos', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Accept'        => 'application/vnd.github.v3+json',
            ],
        ]);

        $rawRepos = $response->toArray();

        $filteredRepos = array_map(function ($repo) {
            return [
                'name'        => $repo['name'],
                'full_name'   => $repo['full_name'],
                'html_url'    => $repo['html_url'],
                'description' => $repo['description'],
                'language'    => $repo['language'],
                'forks_count' => $repo['forks_count'],
                'stargazers_count' => $repo['stargazers_count'],
                'watchers_count'   => $repo['watchers_count'],
                'created_at'  => $repo['created_at'],
                'updated_at'  => $repo['updated_at'],
                'private'     => $repo['private'],
            ];
        }, $rawRepos);

        return $this->json([
            'username' => $githubUsername,
            'repositories' => $filteredRepos,
        ]);
    }
}
