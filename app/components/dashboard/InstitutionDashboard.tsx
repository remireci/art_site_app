"use client"
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InstitutionTab from "./InstitutionTab";
import ExhibitionsTab from "./ExhibitionsTab";
import { Exhibition } from "@/types";

interface Props {
    data: Exhibition[];
}

export default function InstitutionDashboard({ data }: Props) {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-slate-600 text-lg text-center font-semibold mb-12 lg:text-xl">Dashboard</h1>
            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid grid-cols-4 w-full mb-4">
                    <TabsTrigger value="info">Institution</TabsTrigger>
                    <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
                    <TabsTrigger value="ads">Ads</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                {/* Institution Info Tab */}
                {/* <TabsContent value="info">
                    <Card>
                        <CardContent className="space-y-4 py-4">
                            <Input placeholder="Institution Name" />
                            <Input placeholder="City" />
                            <Input placeholder="Website" />
                            <Textarea placeholder="Short Description" />
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent> */}

                <TabsContent value="info">
                    <InstitutionTab />
                </TabsContent>

                {/* Exhibitions Tab */}
                <TabsContent value="exhibitions">
                    {/* <Card> */}
                    {/* <CardContent className="space-y-4 py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Current Exhibitions</h2>
                                <Button>Add Exhibition</Button>
                            </div> */}
                    {/* Exhibition entries would go here */}
                    {/* <p className="text-muted-foreground">No exhibitions yet.</p> */}
                    {/* </CardContent> */}
                    {/* <ExhibitionsTab /> */}
                    {/* </Card> */}
                    <ExhibitionsTab
                        data={data}
                    />
                </TabsContent>

                {/* Ads Tab */}
                <TabsContent value="ads">
                    <Card>
                        <CardContent className="space-y-4 py-4">
                            <h2 className="text-xl font-semibold">Promote Your Event</h2>
                            <Input type="file" />
                            <Input placeholder="Link to your event or website" />
                            <select className="border rounded px-3 py-2">
                                <option value="1week">1 week - €10</option>
                                <option value="2weeks">2 weeks - €18</option>
                            </select>
                            <Button>Pay & Publish</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <Card>
                        <CardContent className="space-y-2 py-4">
                            <h2 className="text-xl font-semibold">Past Exhibitions</h2>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                <li>&quot;Exhibition Title A&quot; - Jan-Mar 2023</li>
                                <li>&quot;Exhibition Title B&quot; - Sep-Nov 2022</li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
