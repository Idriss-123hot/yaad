
import { cn } from '@/lib/utils';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  className?: string;
}

export function TeamMemberCard({ member, className }: TeamMemberCardProps) {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      {/* Team Member Image */}
      <div className="aspect-square overflow-hidden">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Team Member Info */}
      <div className="p-6">
        <h3 className="font-medium text-lg mb-1">{member.name}</h3>
        <p className="text-terracotta-600 text-sm mb-3">{member.role}</p>
        <p className="text-sm text-muted-foreground">{member.bio}</p>
      </div>
    </div>
  );
}

export default TeamMemberCard;
