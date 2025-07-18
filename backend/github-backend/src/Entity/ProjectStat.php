<?php

namespace App\Entity;

use App\Repository\ProjectStatRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProjectStatRepository::class)]
class ProjectStat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $projectName = null;

    #[ORM\Column]
    private ?int $gitCloneCount = null;

    #[ORM\Column]
    private ?int $visitCount = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $recordedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProjectName(): ?string
    {
        return $this->projectName;
    }

    public function setProjectName(string $projectName): static
    {
        $this->projectName = $projectName;

        return $this;
    }

    public function getGitCloneCount(): ?int
    {
        return $this->gitCloneCount;
    }

    public function setGitCloneCount(int $gitCloneCount): static
    {
        $this->gitCloneCount = $gitCloneCount;

        return $this;
    }

    public function getVisitCount(): ?int
    {
        return $this->visitCount;
    }

    public function setVisitCount(int $visitCount): static
    {
        $this->visitCount = $visitCount;

        return $this;
    }

    public function getRecordedAt(): ?\DateTimeInterface
    {
        return $this->recordedAt;
    }

    public function setRecordedAt(\DateTimeInterface $recordedAt): static
    {
        $this->recordedAt = $recordedAt;

        return $this;
    }
}
