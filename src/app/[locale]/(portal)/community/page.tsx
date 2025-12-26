"use client";

import { Suspense } from 'react';
import CommunityContent from './CommunityContent';

export default function CommunityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CommunityContent />
    </Suspense>
  );
}
