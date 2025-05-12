import React from 'react';
import { VideoUploadForm, VideoList, VideoPlayer } from '../../components';
import { useuseUploadVideo, useuseProcessStatus } from '../../hooks';
import { useVideoStore } from '../../store';


interface VideoanalyticsPageProps {
  // Add any page props here (e.g., from getServerSideProps)
}

export default function VideoanalyticsPage({}: VideoanalyticsPageProps) {
  // Hooks usage
  const useUploadVideo = useUseuploadvideo();
  const useProcessStatus = useUseprocessstatus();
  
  // Store usage
  const { state, actions } = useVideoStore();

  return (
    <div className="videoanalytics-page">
      <h1>Videoanalytics Page</h1>
      
      {/* Example component usage */}
      <VideoUploadForm />
    </div>
  );
}

// Uncomment if you need server-side props
// export async function getServerSideProps(context) {
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }