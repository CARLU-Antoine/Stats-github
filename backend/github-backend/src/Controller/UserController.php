<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Exception\InvalidStateException;
use League\OAuth2\Client\Provider\GithubResourceOwner;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController extends AbstractController
{
    public function connect(ClientRegistry $clientRegistry): Response
    {
        return $clientRegistry->getClient('github')->redirect([], []);
    }

    public function connectCheck(
        Request $request,
        ClientRegistry $clientRegistry,
        EntityManagerInterface $em
    ): Response {
        $client = $clientRegistry->getClient('github');

        try {
            $accessToken = $client->getAccessToken();
            /** @var GithubResourceOwner $githubUser */
            $githubUser = $client->fetchUserFromToken($accessToken);
        } catch (InvalidStateException $e) {
            $this->addFlash('error', 'Connexion expirée.');
            return $this->redirectToRoute('connect_github');
        } catch (\Exception $e) {
            $this->addFlash('error', 'Erreur : ' . $e->getMessage());
            return $this->redirectToRoute('connect_github');
        }

        $githubId = $githubUser->getId();
        $username = $githubUser->getNickname();
        $email = $githubUser->getEmail(); // parfois null selon les autorisations

        // Vérifie si l'utilisateur existe déjà
        $user = $em->getRepository(User::class)->findOneBy(['githubId' => $githubId]);

        if (!$user) {
            // Nouvel utilisateur : on le crée
            $user = new User();
            $user->setGithubId($githubId);
            $user->setUsername($username);
            $user->setEmail($email);

            $em->persist($user);
            $em->flush();

            $this->addFlash('success', 'Compte créé pour ' . $username);
        } else {
            $this->addFlash('success', 'Bienvenue de retour ' . $username);
        }

        // 🔒 Tu pourrais maintenant te connecter réellement (via authentification manuelle ou LexikJWT, etc.)

        return $this->redirectToRoute('homepage');
    }
}
