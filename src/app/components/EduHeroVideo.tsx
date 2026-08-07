"use client";

import { useState } from "react";

/** "İlk Şarkımız" tanıtım videosu — tıklanana kadar hafif bir önizleme kartı gösterir,
 *  tıklanınca YouTube gömülü oynatıcısını yükler (iframe baştan yüklenmez). */
export function EduHeroVideo() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="edu-video">
        <iframe
          src="https://www.youtube-nocookie.com/embed/SBU7TrPvlyA?start=1&autoplay=1&rel=0"
          title="İlk Şarkımız"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="edu-video edu-video-facade"
      onClick={() => setPlaying(true)}
      aria-label="İlk Şarkımız videosunu oynat"
      style={{ backgroundImage: "url(https://img.youtube.com/vi/SBU7TrPvlyA/maxresdefault.jpg)" }}
    >
      <span className="edu-video-tag"><i />İlk Şarkımız · eistatistik</span>
      <span className="edu-video-play" aria-hidden="true">
        <svg width={30} height={30} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
      </span>
      <span className="edu-video-brand">eistatistik.com</span>
    </button>
  );
}
