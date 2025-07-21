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
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Psr\Log\LoggerInterface;

class GithubController extends AbstractController
{
    #[Route('/api/connect/github', name: 'connect_github')]
    public function connect(ClientRegistry $clientRegistry): Response
    {
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
            $accessToken = $client->getAccessToken();
            /** @var GithubResourceOwner $user */
            $user = $client->fetchUserFromToken($accessToken);

            $session->set('github_token', $accessToken->getToken());
            $session->set('github_username', $user->getNickname());

            return $this->redirect('http://localhost:3000/github-success');
        } catch (InvalidStateException|\Exception $e) {
            return $this->redirectToRoute('connect_github');
        }
    }


    #[Route('/api/github/repos', name: 'api_github_repos', methods: ['POST'])]
    public function getRepositories(
        Request $request,
        HttpClientInterface $httpClient,
        SessionInterface $session,
        CacheInterface $cache,
        LoggerInterface $logger
    ): JsonResponse {
        if (!$session->has('github_token')) {
            return $this->json(['error' => 'Utilisateur non connecté à GitHub'], 401);
        }

        $token = $session->get('github_token');
        $body = json_decode($request->getContent(), true);
        $forceRefresh = $body['force_refresh'] ?? false;

        $cacheKey = 'github_repos_' . sha1($token);

        if (!$forceRefresh) {
            $data = $cache->get($cacheKey, function (ItemInterface $item) use ($httpClient, $token) {
                $item->expiresAfter(3600);
                return $this->fetchGithubData($httpClient, $token);
            });

            return $this->json($data);
        }

        $data = $this->fetchGithubData($httpClient, $token);
        $cache->delete($cacheKey);
        $cache->get($cacheKey, function (ItemInterface $item) use ($data) {
            $item->expiresAfter(3600);
            return $data;
        });

        return $this->json($data);
    }


    private function fetchGithubData(HttpClientInterface $httpClient, string $token): array
    {
        
        $repoResponse = $httpClient->request('GET', 'https://api.github.com/user/repos', [
            'headers' => [
                'Authorization' => 'token ' . $token,
                'Accept'        => 'application/vnd.github.v3+json',
                'User-Agent'    => 'Symfony-App'
            ],
        ]);

        if (200 !== $repoResponse->getStatusCode()) {
            return ['error' => 'Impossible de récupérer les dépôts GitHub'];
        }

        $repos = $repoResponse->toArray();
        $results = [];
        $promises = [];

        foreach ($repos as $repo) {
            $owner = $repo['owner']['login'];
            $name = $repo['name'];

            $viewsKey = "{$owner}/{$name}_views";
            $clonesKey = "{$owner}/{$name}_clones";

            $promises[$viewsKey] = $httpClient->request('GET', "https://api.github.com/repos/{$owner}/{$name}/traffic/views", [
                'headers' => [
                    'Authorization' => 'token ' . $token,
                    'Accept'        => 'application/vnd.github.v3+json',
                    'User-Agent'    => 'Symfony-App'
                ],
            ]);

            $promises[$clonesKey] = $httpClient->request('GET', "https://api.github.com/repos/{$owner}/{$name}/traffic/clones", [
                'headers' => [
                    'Authorization' => 'token ' . $token,
                    'Accept'        => 'application/vnd.github.v3+json',
                    'User-Agent'    => 'Symfony-App'
                ],
            ]);
        }

        foreach ($repos as $repo) {
            $owner = $repo['owner']['login'];
            $name = $repo['name'];

            $viewsKey = "{$owner}/{$name}_views";
            $clonesKey = "{$owner}/{$name}_clones";

            $views = null;
            $clones = null;

            try {
                $viewsResponse = $promises[$viewsKey];
                if ($viewsResponse->getStatusCode() === 200) {
                    $views = $viewsResponse->toArray();
                }
            } catch (\Throwable $e) {}

            try {
                $clonesResponse = $promises[$clonesKey];
                if ($clonesResponse->getStatusCode() === 200) {
                    $clones = $clonesResponse->toArray();
                }
            } catch (\Throwable $e) {}

            
            $results[] = [
                'name' => $name,
                'owner' => $owner,
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
                'views' => $views,
                'clones' => $clones,
            ];
        }

        // Trier les projets par projet récent
        usort($results, function ($a, $b) {
            return strtotime($b['created_at']) <=> strtotime($a['created_at']);
        });
                
        return [
            'repositories' => $results
        ];
    }

    #[Route('/api/github/deconnexion', name: 'connect_github_logout', methods: ['POST'])]
    public function logout(SessionInterface $session): JsonResponse
    {
        $session->remove('github_token');
        $session->remove('github_username');

        return $this->json(['message' => 'Déconnexion réussie']);
    }
}
