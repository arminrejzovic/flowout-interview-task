import CustomerChart from "@/components/CustomerChart";

export default function Home() {
  return (
    <main>
        <nav className={"h-16 flex items-center p-6 bg-purple-600 font-bold text-white"}>Test Task</nav>
        <div className={"p-4"}>
            <CustomerChart/>
        </div>
    </main>
  );
}
