"use client";
import { motion } from "framer-motion";
  import Image from "next/image";
import SpotifyEmbed from "./SpotifyEmbed";
import Footer from "./footer";
import Home from "./home";
import Introduction from "./introduction";
import Hero from "./hero";
import CalendarLayout from "./news";
import VoteAwards from "./Vote";
import FanProjects from "./fanproject";
import LoginPage from "./auth/login/page";
import EventsPage from "./events/page";
import MusicListPage from "./music-releases/page";
import NewsListPage from "./news/page";
import '../app/globals.css';
import YouTubeStats_admin from "../components/YoutubeStats/index";
import YouTubeStats_user from "../components/YoutubeStats/user/index_user";
import SpotifyStats_admin from "../components/Spotify";
import SpotifyStats_user from "../components/Spotify/user/index_user";
import StationHead from "./stationhead";

export default function App() {
  
  return (
    <main className="relative min-h-screen text-white scroll-smooth overflow-y-auto scrollbar-hide">
  <Hero />
  <Introduction />
  <SpotifyEmbed />
  <CalendarLayout />
  <MusicListPage />
  <EventsPage />
  
        <StationHead />

  {/*<Home />*/}

  {/* Thêm YouTube Stats Section */}
      <YouTubeStats_user />

      <SpotifyStats_user />
      
</main>

   
  );
}
