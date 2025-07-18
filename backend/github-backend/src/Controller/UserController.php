<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    private $em;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher)
    {
        $this->em = $em;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/api/creer-compte', name: 'user_register', methods: ['POST'])]
    public function register(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'] ?? null;
        $plainPassword = $data['password'] ?? null;

        if (!$username || !$plainPassword) {
            return $this->json(['error' => 'Username and password required'], 400);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $this->em->getRepository(User::class)->findOneBy(['username' => $username]);
        if ($existingUser) {
            return $this->json(['error' => 'Username already taken'], 400);
        }

        // Créer nouvel utilisateur
        $user = new User();
        $user->setUsername($username);
        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        $this->em->persist($user);
        $this->em->flush();

        return $this->json(['message' => 'User created'], 201);
    }

    #[Route('/api/connexion', name: 'user_login', methods: ['POST'])]
    public function login(Request $request): Response
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'] ?? null;
        $plainPassword = $data['password'] ?? null;

        if (!$username || !$plainPassword) {
            return $this->json(['error' => 'Username and password required'], 400);
        }

        $user = $this->em->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        // Vérifier le mot de passe
        if (!$this->passwordHasher->isPasswordValid($user, $plainPassword)) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        // Ici tu peux générer un token JWT, session, etc.  
        // Pour l'exemple simple, on retourne juste un message
        return $this->json(['message' => 'Login successful']);
    }
}
