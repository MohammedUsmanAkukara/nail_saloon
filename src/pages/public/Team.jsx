import React, { useState, useEffect } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import TeamCard from '../../components/common/TeamCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/staff');
        if (res.data?.success) {
          setTeam(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Atelier Collective"
          title="Meet Our Master Nail Artists"
          subtitle="Our technicians bring years of international salon apprenticeships, editorial session styling, and obsessive attention to nail bed architecture."
        />

        {loading ? (
          <LoadingSpinner text="Introducing our artists..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <TeamCard key={member._id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
