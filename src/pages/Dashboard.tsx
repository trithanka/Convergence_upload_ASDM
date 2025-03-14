import { useQuery } from "@tanstack/react-query";
import { getMasterData } from "../services/state/api/masterApi";
import { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useState } from "react";
import {
  Home,
  Table2,
  Book,
  Building2,
  User2,
  Users2,
  Group,
  FileSignature,
  Spline,
  Receipt,
  Settings2,
} from "lucide-react";
import { Link } from "react-router-dom";

// Custom hook for animated count
const useAnimatedCount = (endValue: number, duration: number): number => {
  const motionValue = useMotionValue(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, endValue, {
      duration,
      ease: "easeInOut",
      onUpdate: (latest) => {
        setCount(Math.round(latest));
      },
    });

    return controls.stop; // Cleanup animation on unmount
  }, [endValue, duration, motionValue]);

  return count;
};

const Dashboard: React.FC = () => {
  const { data: masterData } = useQuery({
    queryKey: ["masterData", "dashboard"],
    queryFn: () => getMasterData("dashboard"),
    enabled: true,
  });

  useEffect(() => {
    if (masterData) {
      console.log("Fetched master data:", masterData);
    }
  }, [masterData]);

  // Extract counts from the API response
  const convergenceCounts = masterData?.data?.convergenceCount || {};

  const countItems = [
    {
      label: "Schemes",
      href: "/Scheme",
      count: convergenceCounts.schemesCount?.[0]?.count || 0,
      icon: Table2,
    },
    {
      label: "Courses",
      href: "/Course",
      count: convergenceCounts.coursesCount?.[0]?.count || 0,
      icon: Book,
    },
    {
      label: "Training Partners",
      href: "/TrainingPartner",
      count: convergenceCounts.tpCount?.[0]?.count || 0,
      icon: Users2,
    },
    {
      label: "Training Centers",
      href: "/TrainingCenter",
      count: convergenceCounts.tcCount?.[0]?.count || 0,
      icon: Building2,
    },
    {
      label: "Batches",
      href: "/Batch",
      count: convergenceCounts.batchCount?.[0]?.count || 0,
      icon: Group,
    },
    {
      label: "Candidates",
      href: "/Candidate",
      count: convergenceCounts.candidateCount?.[0]?.count || 0,
      icon: User2,
    },
    {
      label: "Trainers",
      href: "/Trainer",
      count: convergenceCounts.trainerCount?.[0]?.count || 0,
      icon: Spline,
    },
    {
      label: "Assessors",
      href: "/Assessors",
      count: convergenceCounts.assessorCount?.[0]?.count || 0,
      icon: Settings2,
    },
    {
      label: "Targets",
      href: "/Target",
      count: convergenceCounts.targetCount?.[0]?.count || 0,
      icon: Receipt,
    },
    {
      label: "Assessments",
      href: "/Assessment",
      count: convergenceCounts.assessmentCount?.[0]?.count || 0,
      icon: FileSignature,
    },
    {
      label: "Invoices",
      href: "/Invoice",
      count: convergenceCounts.invoiceCount?.[0]?.count || 0,
      icon: Receipt,
    },
    {
      label: "Placements",
      href: "/Placement",
      count: convergenceCounts.placementCount?.[0]?.count || 0,
      icon: Home,
    },
  ];

  // Animation duration
  const duration = 1.5; // seconds

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {countItems.map((item, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const animatedCount = useAnimatedCount(item.count, duration);
          const Icon = item.icon;
          return (
            <Link to={item.href}>
              <motion.div
                key={index}
                className="w-full h-44 bg-white flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-blue-600 mb-2">
                  <Icon size={40} />
                </div>
                <p className="text-lg font-medium text-gray-700">
                  {item.label}
                </p>
                <motion.p
                  className="text-4xl font-semibold text-gray-800 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 2 }}
                  transition={{ duration: 1.0 }}
                >
                  {animatedCount}
                </motion.p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
