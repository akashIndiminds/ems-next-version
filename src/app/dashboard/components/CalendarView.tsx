import React from 'react';
import {
  Calendar as CalendarIcon,
  Briefcase,
  Gift,
  Flag
} from 'lucide-react';

const CalendarView: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" />
          May 2025
        </h2>
        <div className="flex space-x-1">
          <button className="p-1 rounded-md hover:bg-gray-100">
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <button className="p-1 rounded-md hover:bg-gray-100">
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        <div className="text-xs font-medium text-gray-500">Su</div>
        <div className="text-xs font-medium text-gray-500">Mo</div>
        <div className="text-xs font-medium text-gray-500">Tu</div>
        <div className="text-xs font-medium text-gray-500">We</div>
        <div className="text-xs font-medium text-gray-500">Th</div>
        <div className="text-xs font-medium text-gray-500">Fr</div>
        <div className="text-xs font-medium text-gray-500">Sa</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Week 1 */}
        <div className=""></div>
        <div className=""></div>
        <div className=""></div>
        <div className=""></div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">1</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">2</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">3</div>

        {/* Week 2 */}
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">4</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">5</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">6</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">7</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">8</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">9</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">10</div>

          {/* Week 3 */}
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">11</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">12</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">13</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">14</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">15</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">16</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">17</div>

        {/* Week 4 */}
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">18</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">19</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">20</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">21</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">22</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">23</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">24</div>

        {/* Week 5 */}
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">25</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">26</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">27</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">28</div>
        <div className="calendar-day text-sm text-gray-400 flex items-center justify-center h-9 w-9">29</div>
        <div className="calendar-day text-sm text-gray-900 flex items-center justify-center h-9 w-9 active border-2 border-indigo-500 rounded-full">30</div>
        <div className="calendar-day text-sm text-white bg-indigo-600 flex items-center justify-center h-9 w-9 rounded-full today">31</div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-800 mb-3">Upcoming Events</h3>
        <div className="space-y-2">
          <div className="flex items-center p-3 rounded-lg bg-indigo-50 transition-all hover:bg-indigo-100">
            <div className="bg-indigo-100 rounded-md p-2 mr-3">
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Team Meeting</p>
              <p className="text-xs text-gray-500">Today, 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-green-50 transition-all hover:bg-green-100">
            <div className="bg-green-100 rounded-md p-2 mr-3">
              <Gift className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Mike's Birthday</p>
              <p className="text-xs text-gray-500">Jun 5</p>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-blue-50 transition-all hover:bg-blue-100">
            <div className="bg-blue-100 rounded-md p-2 mr-3">
              <Flag className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Project Deadline</p>
              <p className="text-xs text-gray-500">Jun 10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;