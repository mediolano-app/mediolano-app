'use client'

import { useState } from 'react'
import { User, Mail, Lock, Bell, CreditCard, Shield, Info } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm mb-1">Full Name</label>
              <input type="text" id="name" name="name" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm mb-1">Email Address</label>
              <input type="email" id="email" name="email" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm mb-1">Bio</label>
              <textarea id="bio" name="bio" rows={3} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
            </div>
            <button type="submit" className="px-4 py-2 rounded-md hover:bg-blue transition-colors duration-300">
              Save Changes
            </button>
          </form>
        )
      case 'security':
        return (
          <form className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm   mb-1">Current Password</label>
              <input type="password" id="current-password" name="current-password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm   mb-1">New Password</label>
              <input type="password" id="new-password" name="new-password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm   mb-1">Confirm New Password</label>
              <input type="password" id="confirm-password" name="confirm-password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-primary" />
                <span className="ml-2 text-sm ">Enable two-factor authentication</span>
              </label>
            </div>
            <button type="submit" className="px-4 py-2 rounded-md hover:bg-blue transition-colors duration-300">
              Update Security Settings
            </button>
          </form>
        )
      case 'notifications':
        return (
          <form className="space-y-4">
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-primary" />
                <span className="ml-2 text-sm ">Email notifications for new messages</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-primary" />
                <span className="ml-2 text-sm ">Email notifications for IP updates</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-primary" />
                <span className="ml-2 text-sm ">Push notifications for new offers</span>
              </label>
            </div>
            <button type="submit" className="px-4 py-2 rounded-md hover:bg-blue transition-colors duration-300">
              Save Notification Preferences
            </button>
          </form>
        )
      case 'billing':
        return (
          <div className="space-y-4">
            <div className=" p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Current Plan</h3>
              <p>Pro Plan - $49.99/month</p>
              <button className="mt-2 text-primary hover:underline">Upgrade Plan</button>
            </div>
            <div className=" p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <p>Visa ending in 1234</p>
              <button className="mt-2 text-primary hover:underline">Update Payment Method</button>
            </div>
            <div className=" p-4 rounded-md shadow">
              <h3 className="font-semibold mb-2">Billing History</h3>
              <ul className="space-y-2">
                <li>May 1, 2023 - $49.99</li>
                <li>April 1, 2023 - $49.99</li>
                <li>March 1, 2023 - $49.99</li>
              </ul>
              <button className="mt-2 text-primary hover:underline">View Full History</button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
      <div className="max-w-6xl mx-auto mt-10 mb-20">
        <h1 className="text-3xl font-bold mb-6">Dapp Settings</h1>
        <div className="shadow-md rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground p-6 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Your settings are securely stored and managed using blockchain technology, ensuring the highest level of data integrity and protection.
              </p>
            </div>
          </div>
        </div>
        <div className="shadow-md rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50 text-foreground p-6">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center ${activeTab === 'profile' ? 'text-primary' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              Profile
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center ${activeTab === 'security' ? 'text-primary' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock className="w-5 h-5 mx-auto mb-1" />
              Security
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center ${activeTab === 'notifications' ? 'text-primary' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="w-5 h-5 mx-auto mb-1" />
              Notifications
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center ${activeTab === 'billing' ? 'text-primary' : 'hover:bg-blue-500'}`}
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1" />
              Billing
            </button>
          </div>
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
  )
}