/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Program, ProgramDetails, BlogPost } from '../types';
import { PROGRAMS } from '../data';
import { PROGRAM_DETAILS } from '../programData';
import { BLOG_POSTS } from '../blogData';

interface AcademyContextType {
  programs: Program[];
  programDetails: Record<string, ProgramDetails>;
  blogPosts: BlogPost[];
  isLoadingBlogs: boolean;
  refetchBlogs: () => Promise<void>;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const AcademyProvider = ({ children }: { children: ReactNode }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState<boolean>(true);

  const fetchBlogs = async () => {
    try {
      setIsLoadingBlogs(true);
      const res = await fetch('/api/blogs');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBlogPosts(data);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch dynamic blogs from API, using defaults:', err);
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <AcademyContext.Provider value={{
      programs: PROGRAMS,
      programDetails: PROGRAM_DETAILS,
      blogPosts,
      isLoadingBlogs,
      refetchBlogs: fetchBlogs,
    }}>
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) throw new Error('useAcademy must be used within AcademyProvider');
  return context;
};
