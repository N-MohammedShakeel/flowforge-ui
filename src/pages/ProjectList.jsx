import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProjects, setCurrentProject } from "../redux/slices/projectSlice";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector((state) => state.projects);

  // Dummy data for demo
  useEffect(() => {
    const dummyProjects = [
      {
        id: "proj-1",
        name: "Bus Ticket Booking System",
        description:
          "Online platform for searching, booking, and managing bus tickets like RedBus.",
        status: "DRAFT",
        createdAt: "2026-07-03",
        nodeCount: 12,
      },
      {
        id: "proj-2",
        name: "E-commerce BookStore",
        description:
          "Online bookstore with inventory, cart, and payment integration.",
        status: "PUBLISHED",
        createdAt: "2026-07-01",
        nodeCount: 8,
      },
    ];

    dispatch(setProjects(dummyProjects));
  }, [dispatch]);

  const openCanvas = (project) => {
    dispatch(setCurrentProject(project));
    navigate(`/canvas/${project.id}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-gray-900">My Projects</h1>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition-colors"
          >
            <span>+</span> New Architecture
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => openCanvas(project)}
              className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-xl group-hover:text-indigo-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {project.createdAt}
                  </p>
                </div>
                <span
                  className={`text-xs px-4 py-1.5 rounded-full font-medium ${
                    project.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-3">
                {project.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500">{project.nodeCount} nodes</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCanvas(project);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Open Canvas →
                </button>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-3 text-center py-20">
              <p className="text-gray-500 text-lg">No projects yet.</p>
              <p className="text-gray-400 mt-2">
                Create your first architecture from the dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
