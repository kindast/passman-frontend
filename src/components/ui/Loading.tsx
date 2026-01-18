import { LoaderCircle } from "lucide-react";

interface LoadingProps {
  title: string;
}

function Loading({ title }: LoadingProps) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
        <div className="text-gray-900 dark:text-gray-300 text-xl">{title}</div>
      </div>
    </div>
  );
}

export default Loading;
