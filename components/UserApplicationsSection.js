import { 
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function UserApplicationsSection({ 
  userApplications = [], 
  loadingApplications = false, 
  applicationStats = {} 
}) {
  if (loadingApplications) {
    return (
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">My Applications</h2>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">My Applications</h2>
          <div className="flex items-center gap-2">
            {applicationStats.shortlisted > 0 && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                ⭐ {applicationStats.shortlisted} Shortlisted!
              </span>
            )}
            {applicationStats.interview > 0 && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                📞 {applicationStats.interview} Interview!
              </span>
            )}
            {applicationStats.hired > 0 && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                🎉 {applicationStats.hired} Hired!
              </span>
            )}
          </div>
        </div>
        
        {userApplications.length === 0 ? (
          <div className="text-center py-8">
            <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">Start applying to jobs to see your applications here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userApplications
              .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
              .slice(0, 5)
              .map((application) => (
                <div 
                  key={application._id} 
                  className={`border rounded-lg p-4 transition-colors ${
                    application.status === 'shortlisted' 
                      ? 'border-purple-300 bg-purple-50 shadow-md' 
                      : application.status === 'interview'
                      ? 'border-orange-300 bg-orange-50 shadow-md'
                      : application.status === 'hired'
                      ? 'border-green-300 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {application.job?.employer?.companyLogo ? (
                          <img 
                            src={application.job.employer.companyLogo} 
                            alt={application.job.employer.companyName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{application.job?.title}</h3>
                          <p className="text-sm text-gray-600">
                            {application.job?.employer?.companyName || application.job?.employer?.name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{application.job?.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {application.status === 'shortlisted' && (
                        <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-600">⭐</span>
                            <span className="font-medium text-purple-800">Congratulations! You have been shortlisted!</span>
                          </div>
                          <p className="text-sm text-purple-700 mt-1">
                            The employer is interested in your profile. You may hear from them soon!
                          </p>
                        </div>
                      )}
                      
                      {application.status === 'interview' && (
                        <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-600">📞</span>
                            <span className="font-medium text-orange-800">Interview Scheduled!</span>
                          </div>
                          <p className="text-sm text-orange-700 mt-1">
                            Great news! The employer wants to interview you.
                          </p>
                        </div>
                      )}
                      
                      {application.status === 'hired' && (
                        <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">🎉</span>
                            <span className="font-medium text-green-800">Congratulations! You got the job!</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            You have been hired for this position!
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
                        application.status === 'interview' ? 'bg-orange-100 text-orange-800' :
                        application.status === 'hired' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {application.status === 'pending' ? 'Under Review' :
                         application.status === 'reviewing' ? 'In Review' :
                         application.status === 'shortlisted' ? 'Shortlisted' :
                         application.status === 'interview' ? 'Interview' :
                         application.status === 'hired' ? 'Hired' :
                         'Not Selected'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        {/* Application Statistics */}
        {userApplications.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Application Overview</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{applicationStats.total || 0}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{applicationStats.shortlisted || 0}</div>
                <div className="text-xs text-gray-600">Shortlisted</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">{applicationStats.interview || 0}</div>
                <div className="text-xs text-gray-600">Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{applicationStats.hired || 0}</div>
                <div className="text-xs text-gray-600">Hired</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
