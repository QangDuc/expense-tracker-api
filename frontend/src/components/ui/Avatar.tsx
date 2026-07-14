import './Avatar.css';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, name = '', size = 'md' }: AvatarProps) {
  return (
    <div className={`avatar avatar--${size}`}>
      {src ? (
        <img className="avatar__img" src={src} alt={name} />
      ) : (
        <span className="avatar__initials">{getInitials(name || 'U')}</span>
      )}
    </div>
  );
}
