'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface InterviewTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  isPaused?: boolean;
  className?: string;
}

export function InterviewTimer({ duration, onTimeUp, isPaused = false, className = '' }: InterviewTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeUp]);

  useEffect(() => {
    const percentage = (timeRemaining / (duration * 60)) * 100;
    setIsWarning(percentage <= 25 && percentage > 10);
    setIsCritical(percentage <= 10);
  }, [timeRemaining, duration]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (isCritical) return 'text-red-600 bg-red-50 border-red-200';
    if (isWarning) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getProgressColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const progressPercentage = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getTimerColor()}`}>
        <Clock className={`w-4 h-4 ${isCritical ? 'animate-pulse' : ''}`} />
        <span className="font-mono font-semibold text-sm">
          {formatTime(timeRemaining)}
        </span>
        {isPaused && (
          <span className="text-xs font-medium">PAUSED</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${getProgressColor()}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Warning indicator */}
      {(isWarning || isCritical) && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">
            {isCritical ? 'Time Critical!' : 'Time Warning'}
          </span>
        </div>
      )}
    </div>
  );
}
