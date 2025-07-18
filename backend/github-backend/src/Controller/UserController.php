<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Cookie;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UserController extends AbstractController
{
    private $em;
    private $passwordHasher;
    private $jwtSecret;

    private const ACCESS_TOKEN_EXPIRY = 900; // 15 minutes
    private const REFRESH_TOKEN_EXPIRY = 604800; // 7 jours

    public function __construct(EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher)
    {
        $this->em = $em;
        $this->passwordHasher = $passwordHasher;
        $this->jwtSecret = $_ENV['JWT_SECRET']; // Ou getenv('JWT_SECRET');
    }

    #[Route('/api/creer-compte', name: 'user_register', methods: ['POST'])]
    public function register(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'] ?? null;
        $plainPassword = $data['password'] ?? null;

        if (!$username || !$plainPassword) {
            return $this->json(['erreur' => 'Nom d’utilisateur et mot de passe requis.'], 400);
        }

        $existingUser = $this->em->getRepository(User::class)->findOneBy(['username' => $username]);
        if ($existingUser) {
            return $this->json(['erreur' => 'Ce nom d’utilisateur est déjà utilisé.'], 400);
        }

        $user = new User();
        $user->setUsername($username);
        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        $this->em->persist($user);
        $this->em->flush();

        return $this->json(['message' => 'Utilisateur créé avec succès.'], 201);
    }

    #[Route('/api/connexion', name: 'user_login', methods: ['POST'])]
    public function login(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? null;
        $plainPassword = $data['password'] ?? null;

        if (!$username || !$plainPassword) {
            return $this->json(['erreur' => 'Nom d’utilisateur et mot de passe requis.'], 400);
        }

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $plainPassword)) {
            return $this->json(['erreur' => 'Identifiants invalides.'], 401);
        }

        $now = time();

        $accessToken = JWT::encode([
            'user_id' => $user->getId(),
            'username' => $user->getUsername(),
            'exp' => $now + self::ACCESS_TOKEN_EXPIRY
        ], $this->jwtSecret, 'HS256');

        $refreshToken = JWT::encode([
            'user_id' => $user->getId(),
            'exp' => $now + self::REFRESH_TOKEN_EXPIRY
        ], $this->jwtSecret, 'HS256');

        $response = $this->json([
            'access_token' => $accessToken,
            'type_token' => 'Bearer',
            'expire_dans' => self::ACCESS_TOKEN_EXPIRY
        ]);

        // Création du cookie sécurisé pour le refresh token
        $refreshCookie = Cookie::create('refresh_token')
            ->withValue($refreshToken)
            ->withExpires(time() + self::REFRESH_TOKEN_EXPIRY)
            ->withHttpOnly(true)
            ->withSecure($request->isSecure()) // 👈 Détecte HTTPS ou pas
            ->withSameSite('Lax');

        $response->headers->setCookie($refreshCookie);

        return $response;
    }

    #[Route('/api/token/refresh', name: 'token_refresh', methods: ['POST'])]
    public function refreshToken(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $refreshToken = $data['refresh_token'] ?? null;

        if (!$refreshToken) {
            return $this->json(['erreur' => 'Le jeton de rafraîchissement est requis.'], 400);
        }

        try {
            $decoded = JWT::decode($refreshToken, new Key($this->jwtSecret, 'HS256'));
            $user = $this->em->getRepository(User::class)->find($decoded->user_id);

            if (!$user) {
                return $this->json(['erreur' => 'Utilisateur introuvable.'], 401);
            }

            $newAccessToken = JWT::encode([
                'user_id' => $user->getId(),
                'username' => $user->getUsername(),
                'exp' => time() + self::ACCESS_TOKEN_EXPIRY
            ], $this->jwtSecret, 'HS256');

            return $this->json([
                'access_token' => $newAccessToken,
                'type_token' => 'Bearer',
                'expire_dans' => self::ACCESS_TOKEN_EXPIRY
            ]);
        } catch (\Exception $e) {
            return $this->json(['erreur' => 'Jeton de rafraîchissement invalide ou expiré.'], 401);
        }
    }
}
