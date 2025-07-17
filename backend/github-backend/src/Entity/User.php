<?php
// src/Entity/User.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', unique: true)]
    private string $githubId;

    #[ORM\Column(type: 'string')]
    private string $username;

    #[ORM\Column(type: 'string', nullable: true)]
    private ?string $email = null;
}
?>