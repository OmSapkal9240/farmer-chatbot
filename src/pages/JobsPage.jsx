import React from 'react';
import JobCard from '../components/JobCard';

const jobs = [
  {
    id: 1,
    title: 'Farm Worker',
    description: 'Looking for a skilled farm worker for harvesting crops. Experience with modern farming equipment is a plus.'
  },
  {
    id: 2,
    title: 'Irrigation Specialist',
    description: 'Seeking an irrigation specialist to manage and maintain our farm’s irrigation systems. Knowledge of drip irrigation is required.'
  },
  {
    id: 3,
    title: 'Crop Consultant',
    description: 'Hiring a crop consultant to provide expert advice on crop rotation, pest control, and soil management.'
  }
];

const JobsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Job Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
