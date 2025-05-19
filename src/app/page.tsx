import CustomerChart from "@/components/CustomerChart";
import { FolderGit2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
        <nav className={"h-16 flex items-center justify-between p-6 bg-purple-600 font-bold text-white"}>
            Test Task
            <Link href="https://github.com/arminrejzovic/flowout-interview-task" target={"_blank"}>
                <FolderGit2/>
            </Link>
        </nav>
        <div className={"p-4"}>
            <CustomerChart/>
        </div>
    </main>
  );
}
