import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { designService } from '../services/designService';

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch designs using the isolated service
    const fetchDesigns = async () => {
      try {
        const data = await designService.getDesigns();
        setDesigns(data);
      } catch (error) {
        console.error('Failed to fetch designs', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header section with agency branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Newresolutionstudio</h1>
            <p className="text-gray-500 mt-1">Manage your design projects and templates.</p>
          </div>
          <button 
            onClick={() => navigate('/design/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition flex items-center gap-2"
          >
            + Create New Poster
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-gray-400">Loading your designs...</div>
        ) : (
          /* Design Grid */
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
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-200"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center border-b border-gray-100 overflow-hidden relative">
                  {design.thumbnailUrl ? (
                    <img 
                      src={design.thumbnailUrl} 
                      alt={design.title} 
                      className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Preview</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{design.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Edited {new Date(design.updatedAt).toLocaleDateString()}</p>
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