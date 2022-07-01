import blog, { ga, redirects } from "https://deno.land/x/blog@0.3.3/blog.tsx";

const res = await fetch("https://rickandmortyapi.com/api/character");
const body = await res.json();
const characters = body?.results;

const random = Math.floor(Math.random() * 20);

blog({
  title: "My Blog",
  description: "Thinking out loud",
  avatar: characters[random].image,
  avatarClass: "avatar-rounded",
  author: "Vahan Melikyan",
  style: ``,
  background: "#f9f9f9",
  // middlewares: [

  // If you want to set up Google Analytics, paste your GA key here.
  // ga("UA-XXXXXXXX-X"),

  // If you want to provide some redirections, you can specify them here,
  // pathname specified in a key will redirect to pathname in the value.
  // redirects({
  //  "/hello_world.html": "/hello_world",
  // }),

  // ]
});
