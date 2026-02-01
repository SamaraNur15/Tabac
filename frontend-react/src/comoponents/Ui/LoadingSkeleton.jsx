// src/comoponents/Ui/LoadingSkeleton.jsx
import './LoadingSkeleton.css';

export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="skeleton-table">
      <div className="skeleton-table-header">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton-cell skeleton-shimmer"></div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="skeleton-cell skeleton-shimmer"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="skeleton-cards">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-card-header">
            <div className="skeleton-title skeleton-shimmer"></div>
            <div className="skeleton-badge skeleton-shimmer"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line skeleton-shimmer"></div>
            <div className="skeleton-line short skeleton-shimmer"></div>
          </div>
          <div className="skeleton-footer">
            <div className="skeleton-button skeleton-shimmer"></div>
            <div className="skeleton-button skeleton-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const StatsSkeleton = ({ count = 3 }) => {
  return (
    <div className="skeleton-stats">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-stat-card">
          <div className="skeleton-stat-icon skeleton-shimmer"></div>
          <div className="skeleton-stat-content">
            <div className="skeleton-stat-value skeleton-shimmer"></div>
            <div className="skeleton-stat-label skeleton-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
