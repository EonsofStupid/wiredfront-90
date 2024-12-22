import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Users, Workflow, Palette, Settings, HelpCircle, LayoutDashboard, Code2, FileJson } from "lucide-react";

export default function Documents() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Technical Documentation</h1>
          <p className="text-muted-foreground">
            Comprehensive guide to the application's architecture, workflows, and configurations.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                App Overview
              </TabsTrigger>
              <TabsTrigger value="core" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Core Functions
              </TabsTrigger>
              <TabsTrigger value="workflows" className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                Workflows
              </TabsTrigger>
              <TabsTrigger value="schema" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Schema
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Technical Config
              </TabsTrigger>
              <TabsTrigger value="styling" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Styling
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Overview</CardTitle>
                <CardDescription>Current and intended functionalities</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="current">
                    <AccordionTrigger>Current Functionalities</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>User authentication via Supabase</li>
                        <li>Role-based permissions system</li>
                        <li>Real-time data synchronization</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="intended">
                    <AccordionTrigger>Intended Functionalities</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Advanced AI-assisted moderation</li>
                        <li>Multi-step workflow approvals</li>
                        <li>Offline support with auto-sync</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="core" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Core Functions</CardTitle>
                <CardDescription>Essential system functionalities</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="user-management">
                    <AccordionTrigger>User Management</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>User CRUD operations</li>
                        <li>Role and permission management</li>
                        <li>User profile customization</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="moderation">
                    <AccordionTrigger>Content Moderation</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>AI-assisted pre-moderation</li>
                        <li>Manual review workflows</li>
                        <li>Content flagging system</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Workflows</CardTitle>
                <CardDescription>Step-by-step process documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="user-workflow">
                    <AccordionTrigger>User Management Workflow</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Fetch user data from Supabase</li>
                        <li>Display in paginated table interface</li>
                        <li>Process CRUD operations</li>
                        <li>Update user roles and permissions</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="content-workflow">
                    <AccordionTrigger>Content Approval Workflow</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>Content submission</li>
                        <li>AI pre-moderation check</li>
                        <li>Manual review process</li>
                        <li>Final approval/rejection</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schema" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>Database structure and relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Core Tables</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>{`
users
  ├── id (uuid, PK)
  ├── email (string)
  ├── role (enum)
  └── settings (jsonb)

submissions
  ├── id (uuid, PK)
  ├── user_id (uuid, FK)
  ├── content (jsonb)
  └── status (enum)

audit_logs
  ├── id (uuid, PK)
  ├── user_id (uuid, FK)
  ├── action (string)
  └── metadata (jsonb)
                      `}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Configurations</CardTitle>
                <CardDescription>System configuration details</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="frontend">
                    <AccordionTrigger>Frontend Stack</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>React with TypeScript</li>
                        <li>Zustand for state management</li>
                        <li>Tailwind CSS for styling</li>
                        <li>shadcn/ui component library</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="backend">
                    <AccordionTrigger>Backend Services</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Supabase for database and auth</li>
                        <li>Edge Functions for serverless compute</li>
                        <li>Real-time subscriptions</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Styling Guidelines</CardTitle>
                <CardDescription>UI/UX standards and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="current">
                    <AccordionTrigger>Current Implementation</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Responsive dark/light theme</li>
                        <li>Tailwind CSS utility classes</li>
                        <li>Consistent spacing and typography</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="proposed">
                    <AccordionTrigger>Proposed Enhancements</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Enhanced animations</li>
                        <li>Improved accessibility</li>
                        <li>Custom color schemes</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>FAQs & Troubleshooting</CardTitle>
                <CardDescription>Common issues and solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="common-issues">
                    <AccordionTrigger>Common Issues</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>API connection errors</li>
                        <li>State management issues</li>
                        <li>Authentication problems</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="solutions">
                    <AccordionTrigger>Solutions</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Check network connectivity</li>
                        <li>Verify authentication tokens</li>
                        <li>Clear browser cache</li>
                        <li>Review console logs</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}