'use client';

interface RecentActivityProps {
  activities?: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-900 dark:shadow-gray-800/50 sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">최근 활동</h3>
      <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
        {activities.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">최근 활동이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div key={activity.id} className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{activity.type}</span>: {activity.message} ({activity.timestamp})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

