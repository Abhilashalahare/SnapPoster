import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { designService } from '../services/designService';

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchDesigns = async () => {
      setIsLoading(true);
      try {
        const data = await designService.getDesigns();
        if (isMounted) {
          setDesigns(Array.isArray(data) ? [...data] : []);
        }
      } catch (error) {
        console.error('Failed to fetch designs', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchDesigns();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    
    if (window.confirm('Are you sure you want to delete this poster? This cannot be undone.')) {
      try {
        await designService.deleteDesign(id);
        setDesigns(designs.filter(design => design._id !== id));
      } catch (error) {
        console.error('Failed to delete design', error);
        alert('Failed to delete the poster.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">SnapPoster</h1>
            <p className="text-gray-500 mt-1">Manage your design projects and templates.</p>
          </div>
          <button 
            onClick={() => navigate('/design/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition flex items-center gap-2"
          >
            + Create New Poster
          </button>
        </div>

       
        <div className="relative w-full rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 p-8 md:p-10 mb-10 overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between">
          
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-48 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 right-24 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-950 mb-4 tracking-tight">
              Your Poster Creation Studio.
            </h2>
            <p className="text-indigo-900/70 text-lg mb-6 max-w-xl font-medium">
              Streamline projects, master templates, and scale your creative vision. Design to completion in seconds.
            </p>
            
           
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/60 border border-indigo-100 rounded-lg text-sm font-bold text-indigo-800 flex items-center gap-2 backdrop-blur-sm shadow-sm">
                ✨ AI Assistance
              </span>
              <span className="px-4 py-2 bg-white/60 border border-indigo-100 rounded-lg text-sm font-bold text-indigo-800 flex items-center gap-2 backdrop-blur-sm shadow-sm">
                ⚡ Smart Templates
              </span>
              <span className="px-4 py-2 bg-white/60 border border-indigo-100 rounded-lg text-sm font-bold text-indigo-800 flex items-center gap-2 backdrop-blur-sm shadow-sm">
                🚀 Instant Exports
              </span>
            </div>
          </div>

         
          <div className="hidden md:flex relative z-10 items-center justify-center pr-8">
         
            <svg className="w-48 h-48 text-indigo-200 drop-shadow-lg" viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M45.7,144.6L24.3,101.4c-2.8-5.7-2.8-12.4,0-18.1l21.4-43.2c2.8-5.7,8.2-9.7,14.4-10.7l46.8-7.5c6.5-1,13.1,1.1,17.7,5.7l33.8,33.8c4.6,4.6,6.7,11.2,5.7,17.7l-7.5,46.8c-1,6.2-5,11.6-10.7,14.4l-43.2,21.4c-5.7,2.8-12.4,2.8-18.1,0l-43.2-21.4C37.5,154.3,33.5,148.9,32.5,142.7z" opacity="0.5"/>
              <path d="M154.3,55.4l21.4,43.2c2.8,5.7,2.8,12.4,0,18.1l-21.4,43.2c-2.8,5.7-8.2,9.7-14.4,10.7l-46.8,7.5c-6.5,1-13.1-1.1-17.7-5.7L41.6,138.6c-4.6-4.6-6.7-11.2-5.7-17.7l7.5-46.8c1-6.2,5-11.6,10.7-14.4l43.2-21.4c5.7-2.8,12.4-2.8,18.1,0l43.2,21.4C146.1,45.7,151.5,49.7,154.3,55.4z"/>
            </svg>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-gray-400">Loading your designs...</div>
        ) : (
       
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {designs.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                No designs found. Click "Create New Poster" to get started.
              </div>
            )}
            
            {designs.map((design) => (
              <div 
                key={design._id} 
                onClick={() => navigate(`/design/${design._id}`)}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-all duration-200 relative"
              >
                
                <button
                  onClick={(e) => handleDelete(e, design._id)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm z-10"
                  title="Delete Poster"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden relative">
                  {design.thumbnailUrl ? (
                    <img 
                      src={design.thumbnailUrl} 
                      alt={design.title || 'Design Thumbnail'} 
                      className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 bg-white" 
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Preview</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                    {design.title || 'Untitled Design'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Edited {new Date(design.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;