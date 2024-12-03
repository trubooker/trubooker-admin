"use client";

import AgentAlert from "@/components/notifications/AgentAlert";
import Broadcast from "@/components/notifications/Broadcast";
import SystemAlert from "@/components/notifications/SystemAlert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const Notification = () => {
  return (
    <div className="flex flex-col h-fit w-full">
      <div className="flex gap-x-3 items-center ps-3 mb-5">
        <h2 className="text-2xl font-bold">Notification</h2>
      </div>
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full justify-start text-center h-full grid-rows-1 lg:grid-cols-3 gap-y-3 mb-5">
          <TabsTrigger className="me-auto lg:w-full" value="system">
            System Alerts
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="broadcast">
            Broadcast notification
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="agentAlert">
            Agent-specific alerts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="system">
          <SystemAlert />
        </TabsContent>
        <TabsContent value="broadcast">
          <Broadcast />
        </TabsContent>
        <TabsContent value="agentAlert">
          <AgentAlert />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notification;
