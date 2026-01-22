import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🍔 Food Ordering Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience a full-stack application with advanced Role-Based Access Control (RBAC) 
          and location-based filtering
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started →
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-gray-600">Admin, Manager, and Member roles with specific permissions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Location Filtering</h3>
            <p className="text-gray-600">Access data limited to your country (India/America)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
            <p className="text-gray-600">Next.js 14 + NestJS + PostgreSQL + Prisma</p>
          </div>
        </div>
      </div>
    </div>
  );
}