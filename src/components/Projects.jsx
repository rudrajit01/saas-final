'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedProjects = localStorage.getItem("projects");

    if (!token) {
      router.push("/login");
      return;
    }

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const demoProjects = [
        {
          id: 1,
          title: "UI Redesign System",
          description: "Upgrade the product interface with better usability and modern styling.",
          progress: 78,
          status: "In Progress",
          deadline: "12 May 2026",
        },
        {
          id: 2,
          title: "Authentication Module",
          description: "Implement secure login, register, logout, and protected routes.",
          progress: 92,
          status: "Almost Done",
          deadline: "30 Apr 2026",
        },
        {
          id: 3,
          title: "Task Analytics Engine",
          description: "Track completion rate, productivity score, and pending workload metrics.",
          progress: 61,
          status: "In Progress",
          deadline: "18 May 2026",
        },
      ];

      setProjects(demoProjects);
      localStorage.setItem("projects", JSON.stringify(demoProjects));
    }
  }, [router]);

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <p className="projects-label">Workspace Overview</p>
          <h1>Projects</h1>
        </div>

        <button className="back-btn" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div className="project-card" key={project.id}>
            <div className="project-card-top">
              <span className="project-status">{project.status}</span>
              <span className="project-deadline">{project.deadline}</span>
            </div>

            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div className="project-progress">
              <div className="project-progress-head">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill cyan-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}