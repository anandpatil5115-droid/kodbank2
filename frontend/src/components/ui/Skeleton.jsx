export function SkeletonText({ width = '100%', lines = 1 }) {
    return (
        <div>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton skeleton-text"
                    style={{ width: i === lines - 1 && lines > 1 ? '70%' : width }}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ height = '180px' }) {
    return <div className="skeleton skeleton-card" style={{ height }} />;
}

export function SkeletonAvatar({ size = 48 }) {
    return <div className="skeleton skeleton-avatar" style={{ width: size, height: size }} />;
}

export function DashboardSkeleton() {
    return (
        <div style={{ padding: '32px' }}>
            <SkeletonText width="40%" />
            <div style={{ marginTop: 8 }}><SkeletonText width="25%" /></div>
            <div style={{ marginTop: 32 }}><SkeletonCard height="200px" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 32 }}>
                <SkeletonCard height="120px" />
                <SkeletonCard height="120px" />
                <SkeletonCard height="120px" />
            </div>
        </div>
    );
}
