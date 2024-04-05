"use client"

export type WorkItemDto = {
  id: string;
  rev: number;
  url: string;
  fields: {
    "System.Title": string;
  };
  relations?: [{
    rel: string;
    url: string;
    attributes: [any];
  }];
  _links?: {
    self: { href: string; };
    workItemType: { href: string; };
  };
};
