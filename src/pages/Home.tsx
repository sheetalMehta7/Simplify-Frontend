import Header from "../layout/Header";
import BannerImg from "../assets/banner-img.jpg";
export function Home() {
    
  return (
    <main>  
        <Header/>
        <section className="px-32">
            <h2 className="my-10 text-center text-6xl font-extrabold text-slate-900">Simplify Your Workflow</h2>
            <h5 className="mb-10 text-center text-2xl font-semibold text-neutral-700">Organize, Prioritize, and Conquer Your Tasks with Ease.</h5>
            <img src={BannerImg} alt="banner" className="mx-auto w-full max-w-5xl"/>
        </section>
    </main>
  );
}
