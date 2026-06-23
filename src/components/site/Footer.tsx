import { FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="flex items-center justify-between p-2">
      <p className="ml-100 p-4 text-center text-gray-500 text-sm">Built with React, Vite, Tailwind and React Router</p>
      <a className="group mr-100 flex items-center gap-2 p-4" href="https://github.com/MaxY342" rel="noopener noreferrer" target="_blank">
        <FaGithub className="text-gray-500 transition-colors duration-200 group-hover:text-gray-100" />
        <p className="text-gray-500 transition-colors duration-200 group-hover:text-gray-100">Github</p>
      </a>
    </footer>
  );
};
