"use client"
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import InstitutionTab from "./InstitutionTab";
import ExhibitionsTab from "./ExhibitionsTab";
import { AdSubmissionForm } from "./AdSubmissionForm";
import { Exhibition } from "@/types";

interface Props {
    exhibitionsData: Exhibition[];
    locationData: any;
}

export default function InstitutionDashboard({ exhibitionsData, locationData }: Props) {



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


                <TabsContent value="info">
                    <InstitutionTab
                        locationData={locationData}
                    />
                </TabsContent>

                {/* Exhibitions Tab */}
                <TabsContent value="exhibitions">
                    <ExhibitionsTab
                        exhibitionsData={exhibitionsData}
                        locationData={locationData}
                    />
                </TabsContent>

                {/* Ads Tab */}
                <TabsContent value="ads">
                    {/* <Card>
                        <CardContent className="space-y-4 py-4">
                            <h2 className="text-xl font-semibold">Promote Your Event</h2>
                            <Input type="file" />
                            <Input placeholder="Link to your event or website" />
                            <select className="border rounded px-3 py-2">
                                <option value="1week">1 week - €75</option>
                                <option value="2weeks">2 weeks - €120</option>
                                <option value="2weeks">4 weeks - €200</option>
                                <option value="2weeks">8 weeks - €350</option>
                            </select>
                            <Button>Pay & Publish</Button>
                        </CardContent>
                    </Card> */}
                    <AdSubmissionForm />
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
