"use client"
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdSubmissionForm() {
    const [file, setFile] = useState<File | null>(null);
    const [link, setLink] = useState("");
    const [startDate, setStartDate] = useState("");
    const [duration, setDuration] = useState("1week");
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        if (!file || !email || !link || !startDate) {
            alert("Please fill out all fields.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("link", link);
        formData.append("startDate", startDate);
        formData.append("duration", duration);
        formData.append("email", email);

        const res = await fetch("/api/ads/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            alert("Ad submitted successfully!");
        } else {
            alert("Error: " + data.error);
        }
    };

    return (
        <TabsContent value="ads">
            <Card>
                <CardContent className="space-y-4 py-4">
                    <h2 className="text-xl font-semibold">Promote Your Event</h2>
                    <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <Input
                        placeholder="Link to your event or website"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <Input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <select
                        className="border rounded px-3 py-2"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    >
                        <option value="1week">1 week - €75</option>
                        <option value="2weeks">2 weeks - €120</option>
                        <option value="4weeks">4 weeks - €200</option>
                        <option value="8weeks">8 weeks - €350</option>
                    </select>
                    <Button onClick={handleSubmit}>Pay & Publish</Button>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
