import BannerImg from '../assets/banner-img.jpg'

export function Home() {
  return (
    <main>
      <section className="px-32 bg-gray-100 dark:bg-gray-900 py-16">
        <h2 className="my-10 text-center text-6xl font-extrabold text-gray-700 dark:text-white">
          Simplify Your Workflow
        </h2>
        <h5 className="mb-10 text-center text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Organize, Prioritize, and Conquer Your Tasks with Ease.
        </h5>
        <img
          src={BannerImg}
          alt="banner"
          className="mx-auto w-full max-w-5xl"
        />
      </section>
    </main>
  )
}
