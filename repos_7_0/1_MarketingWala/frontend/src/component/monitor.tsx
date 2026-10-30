"use client"

import { useState } from "react"
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { CalendarIcon, InstagramIcon } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

// Type definitions
type DateRange = "7d" | "30d" | "3m"

interface FollowerData {
  date: string
  followers: number
}

interface ReachImpressionData {
  date: string
  reach: number
  impressions: number
}

interface PostData {
  id: string
  type: "IMAGE" | "CAROUSEL_ALBUM" | "VIDEO"
  caption: string
  likes: number
  comments: number
  reach: number
  impressions: number
  saved: number
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

// Mock data
const followerData: FollowerData[] = [
  { date: "2023-05-01", followers: 10000 },
  { date: "2023-05-02", followers: 10050 },
  { date: "2023-05-03", followers: 10120 },
  { date: "2023-05-04", followers: 10200 },
  { date: "2023-05-05", followers: 10300 },
  { date: "2023-05-06", followers: 10450 },
  { date: "2023-05-07", followers: 10600 },
]

const reachImpressionData: ReachImpressionData[] = [
  { date: "2023-05-01", reach: 5000, impressions: 7500 },
  { date: "2023-05-02", reach: 5200, impressions: 7800 },
  { date: "2023-05-03", reach: 5400, impressions: 8100 },
  { date: "2023-05-04", reach: 5100, impressions: 7650 },
  { date: "2023-05-05", reach: 5300, impressions: 7950 },
  { date: "2023-05-06", reach: 5600, impressions: 8400 },
  { date: "2023-05-07", reach: 5800, impressions: 8700 },
]

const recentPostsData: PostData[] = [
  { id: "1", type: "IMAGE", caption: "Check out our new product!", likes: 1200, comments: 300, reach: 5000, impressions: 7500, saved: 150 },
  { id: "2", type: "CAROUSEL_ALBUM", caption: "Summer collection is here!", likes: 1500, comments: 350, reach: 5500, impressions: 8250, saved: 200 },
  { id: "3", type: "VIDEO", caption: "Behind the scenes look", likes: 1800, comments: 400, reach: 6000, impressions: 9000, saved: 250 },
  { id: "4", type: "IMAGE", caption: "Limited time offer!", likes: 1300, comments: 280, reach: 4800, impressions: 7200, saved: 130 },
  { id: "5", type: "CAROUSEL_ALBUM", caption: "Customer testimonials", likes: 1100, comments: 320, reach: 4500, impressions: 6750, saved: 180 },
]

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
)

export default function InstagramDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>("7d")

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center space-x-2">
          <InstagramIcon className="h-6 w-6 text-pink-600" />
          <h1 className="text-2xl font-bold">Instagram Analytics Dashboard</h1>
        </div>
        <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Followers"
            value="10,600"
            change="+6% from last week"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <MetricCard
            title="Average Reach"
            value="5,343"
            change="+12% from last week"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
          />
          <MetricCard
            title="Average Impressions"
            value="8,014"
            change="+8% from last week"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            }
          />
          <MetricCard
            title="Engagement Rate"
            value="4.5%"
            change="+0.5% from last week"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Followers Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={followerData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip />
                  <Line type="monotone" dataKey="followers" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Reach vs Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={reachImpressionData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reach" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="impressions" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Recent Posts Performance</CardTitle>
            <CardDescription>Detailed insights for your latest Instagram posts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Reach</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Saved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPostsData.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.id}</TableCell>
                    <TableCell>{post.type}</TableCell>
                    <TableCell className="max-w-xs truncate">{post.caption}</TableCell>
                    <TableCell>{post.likes}</TableCell>
                    <TableCell>{post.comments}</TableCell>
                    <TableCell>{post.reach}</TableCell>
                    <TableCell>{post.impressions}</TableCell>
                    <TableCell>{post.saved}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}