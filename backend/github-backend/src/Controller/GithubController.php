<?php

namespace App\Controller;

use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Exception\InvalidStateException;
use League\OAuth2\Client\Provider\GithubResourceOwner;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Attribute\Route;

class GithubController extends AbstractController
{
    #[Route('/api/connect/github', name: 'connect_github')]
    public function connect(ClientRegistry $clientRegistry): Response
    {
        // Redirige vers GitHub pour autorisation OAuth avec les bons scopes
        return $clientRegistry->getClient('github')->redirect(
            ['user', 'repo'], // Scopes
            []
        );
    }

    #[Route('/api/connect/github/check', name: 'connect_github_check')]
    public function connectCheck(
        Request $request,
        ClientRegistry $clientRegistry,
        SessionInterface $session
    ): Response {
        $client = $clientRegistry->getClient('github');

        try {
            // Récupère le token d’accès via le code OAuth
            $accessToken = $client->getAccessToken();

            // Récupère l’utilisateur GitHub
            /** @var GithubResourceOwner $user */
            $user = $client->fetchUserFromToken($accessToken);

            // Stocke le token GitHub en session
            $session->set('github_token', $accessToken->getToken());
            $session->set('github_username', $user->getNickname());

            return $this->redirect('http://localhost:3000/github-success');
        } catch (InvalidStateException|\Exception $e) {
            return $this->redirectToRoute('connect_github');
        }
    }

    #[Route('/api/github/repos', name: 'api_github_repos', methods: ['GET'])]
    public function getRepositories(HttpClientInterface $httpClient, SessionInterface $session): Response
    {
        if (!$session->has('github_token')) {
            return $this->json(['error' => 'Utilisateur non connecté à GitHub'], 401);
        }

        $token = $session->get('github_token');

        $response = $httpClient->request('GET', 'https://api.github.com/user/repos', [
            'headers' => [
                'Authorization' => 'token ' . $token,
                'Accept'        => 'application/vnd.github.v3+json',
                'User-Agent'    => 'Symfony-App'
            ],
        ]);

        if (200 !== $response->getStatusCode()) {
            return $this->json(['error' => 'Impossible de récupérer les dépôts GitHub'], 500);
        }

        $repos = $response->toArray();

        $filtered = array_map(fn($repo) => [
            'name' => $repo['name'],
            'full_name' => $repo['full_name'],
            'html_url' => $repo['html_url'],
            'description' => $repo['description'],
            'language' => $repo['language'],
            'private' => $repo['private'],
            'created_at' => $repo['created_at'],
            'updated_at' => $repo['updated_at'],
            'stargazers_count' => $repo['stargazers_count'],
            'watchers_count' => $repo['watchers_count'],
            'forks_count' => $repo['forks_count'],
        ], $repos);

        return $this->json([
            'repositories' => $filtered
        ]);
    }

    #[Route('/api/github/deconnexion', name: 'connect_github_logout', methods: ['POST'])]
    public function logout(SessionInterface $session): Response
    {
        // Vide les infos GitHub stockées en session
        $session->remove('github_token');
        $session->remove('github_username');

        return $this->json(['message' => 'Déconnexion réussie']);
    }
}
