
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export function Home() {
  return (
    <form className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1" value="Your password" />
        </div>
        <TextInput id="password1" type="password" required />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember">Remember me</Label>
      </div>
      <Button type="submit">Submit</Button>
    </form>
//      <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
//      <h1 className="text-2xl dark:text-white">Flowbite React + Vite</h1>
//      <DarkThemeToggle />
//    </main>
  );
}
