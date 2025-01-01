'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Goal } from '@/types';
import { DatePicker } from '@/components/ui/date-picker';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GOAL_CATEGORIES = {
  'Language Learning': [
    'Learn Spanish', 'Master Mandarin', 'Study Japanese', 'Learn Arabic',
    'Practice French', 'Study German', 'Learn Italian', 'Master Sign Language'
  ],
  'Academic Growth': [
    'Complete PhD', 'Maintain 4.0 GPA', 'Publish Research', 'Win Academic Award',
    'Get Scholarship', 'Study Abroad', 'Join Honor Society', 'Lead Research Project'
  ],
  'Skill Development': [
    'Learn Photography', 'Master Cooking', 'Study Web Development', 'Learn Digital Marketing',
    'Practice Public Speaking', 'Learn Video Editing', 'Master Data Analysis', 'Study AI/ML'
  ],
  'Professional Certifications': [
    'Get AWS Certification', 'Complete PMP', 'Obtain CPA License', 'Get CISSP Certification',
    'Earn Teaching License', 'Get Real Estate License', 'Complete MCSE', 'Obtain Six Sigma'
  ],

  'Career Advancement': [
    'Get Promotion', 'Switch Careers', 'Start Business', 'Increase Salary',
    'Lead Team Project', 'Expand Network', 'Find Mentor', 'Become Manager'
  ],
  'Business Growth': [
    'Increase Revenue', 'Expand Market', 'Launch Product', 'Improve ROI',
    'Reduce Costs', 'Hire Team', 'Open New Location', 'Secure Funding'
  ],
  'Entrepreneurship': [
    'Start Startup', 'Create Business Plan', 'Find Investors', 'Launch MVP',
    'Build Team', 'Secure Patents', 'Develop Brand', 'Scale Operations'
  ],
  'Leadership': [
    'Lead Department', 'Mentor Team', 'Improve Communication', 'Build Culture',
    'Develop Strategy', 'Manage Crisis', 'Drive Innovation', 'Build Partnerships'
  ],

  'Weight Management': [
    'Lose Weight', 'Gain Muscle', 'Maintain Weight', 'Reduce Body Fat',
    'Build Strength', 'Improve BMI', 'Track Calories', 'Follow Diet Plan'
  ],
  'Exercise Goals': [
    'Run Marathon', 'Do 100 Pushups', 'Complete Triathlon', 'Master Yoga',
    'Climb Mountain', 'Cycle Century', 'Swim Mile', 'Practice Martial Arts'
  ],
  'Mental Health': [
    'Reduce Anxiety', 'Practice Mindfulness', 'Improve Sleep', 'Manage Stress',
    'Build Resilience', 'Overcome Fear', 'Find Balance', 'Increase Happiness'
  ],
  'Nutrition': [
    'Eat Vegetarian', 'Follow Keto', 'Cook Healthy', 'Meal Prep',
    'Reduce Sugar', 'Increase Protein', 'Stay Hydrated', 'Take Vitamins'
  ],

  'Savings': [
    'Save Emergency Fund', 'Build Retirement', 'Save for House', 'Create College Fund',
    'Build Wealth', 'Save for Travel', 'Invest Monthly', 'Reduce Expenses'
  ],
  'Debt Management': [
    'Pay Off Credit Cards', 'Clear Student Loans', 'Eliminate Mortgage', 'Improve Credit Score',
    'Consolidate Debt', 'Create Payment Plan', 'Reduce Interest', 'Build Credit'
  ],
  'Investment': [
    'Start Stock Portfolio', 'Buy Real Estate', 'Invest in Crypto', 'Build Passive Income',
    'Diversify Assets', 'Start IRA', 'Buy Bonds', 'Join Investment Club'
  ],
  'Financial Planning': [
    'Create Budget', 'Track Expenses', 'Set Financial Goals', 'Plan Retirement',
    'Get Insurance', 'Make Will', 'Review Investments', 'Meet Financial Advisor'
  ],

  'Family': [
    'Spend Family Time', 'Improve Parenting', 'Support Parents', 'Connect with Siblings',
    'Plan Family Events', 'Create Traditions', 'Document History', 'Strengthen Bonds'
  ],
  'Romance': [
    'Find Partner', 'Improve Marriage', 'Plan Wedding', 'Build Trust',
    'Better Communication', 'Plan Dates', 'Show Appreciation', 'Create Romance'
  ],
  'Social Life': [
    'Make Friends', 'Join Groups', 'Host Events', 'Attend Meetups',
    'Build Network', 'Stay Connected', 'Plan Gatherings', 'Strengthen Friendships'
  ],
  'Community': [
    'Volunteer Weekly', 'Join Organization', 'Lead Community Project', 'Help Neighbors',
    'Support Charity', 'Teach Others', 'Build Community', 'Make Impact'
  ],

  'Home Improvement': [
    'Renovate House', 'Organize Space', 'Create Garden', 'Declutter Home',
    'Improve Security', 'Reduce Energy Use', 'Maintain Property', 'Decorate Space'
  ],
  'Travel': [
    'Visit Countries', 'Plan World Trip', 'Learn Culture', 'Try Local Food',
    'Learn Geography', 'Document Journey', 'Meet Locals', 'Collect Memories'
  ],
  'Hobbies': [
    'Learn Instrument', 'Start Collection', 'Join Club', 'Create Art',
    'Build Projects', 'Write Stories', 'Make Music', 'Practice Craft'
  ],
  'Entertainment': [
    'Read Books', 'Watch Films', 'Attend Concerts', 'Visit Museums',
    'See Theater', 'Experience Culture', 'Follow Series', 'Discover Music'
  ],

  'Digital Skills': [
    'Learn Programming', 'Master Software', 'Build Website', 'Create App',
    'Study Cybersecurity', 'Learn Cloud', 'Master Office', 'Understand AI'
  ],
  'Content Creation': [
    'Start YouTube', 'Build Blog', 'Create Podcast', 'Grow Social Media',
    'Make Videos', 'Write Content', 'Build Audience', 'Monetize Platform'
  ],
  'Gaming': [
    'Complete Game', 'Reach Rank', 'Win Tournament', 'Build Team',
    'Stream Content', 'Create Mods', 'Learn Design', 'Develop Game'
  ],
  'Innovation': [
    'File Patent', 'Create Invention', 'Develop Solution', 'Build Prototype',
    'Test Ideas', 'Get Funding', 'Launch Product', 'Scale Innovation'
  ],

  'Spiritual Growth': [
    'Practice Faith', 'Study Religion', 'Find Purpose', 'Build Community',
    'Daily Prayer', 'Learn Teachings', 'Attend Services', 'Share Faith'
  ],
  'Personal Values': [
    'Define Values', 'Live Authentically', 'Build Character', 'Show Integrity',
    'Practice Kindness', 'Be Honest', 'Show Gratitude', 'Help Others'
  ],
  'Life Purpose': [
    'Find Calling', 'Make Impact', 'Leave Legacy', 'Achieve Dreams',
    'Set Direction', 'Build Mission', 'Create Vision', 'Follow Path'
  ],
  'Mindfulness': [
    'Daily Meditation', 'Practice Presence', 'Reduce Stress', 'Find Peace',
    'Build Awareness', 'Stay Centered', 'Learn Breathing', 'Practice Yoga'
  ],

  'Digital Detox': [
    'Reduce Screen Time', 'Limit Social Media', 'Control Gaming', 'Minimize Distractions',
    'Set Boundaries', 'Practice Digital Wellness', 'Be Present', 'Find Balance'
  ],
  'Health Habits': [
    'Quit Smoking', 'Reduce Alcohol', 'Stop Junk Food', 'Break Sugar Addiction',
    'Fix Sleep Schedule', 'Stop Nail Biting', 'Reduce Caffeine', 'Quit Energy Drinks'
  ],
  'Productivity': [
    'Stop Procrastinating', 'Reduce Multitasking', 'Minimize Distractions', 'Break Time Wasting',
    'End Perfectionism', 'Stop Overworking', 'Manage Time', 'Focus Better'
  ],
  'Emotional Patterns': [
    'Stop Negative Talk', 'Control Anger', 'Reduce Worry', 'Break Overthinking',
    'End Comparison', 'Stop Complaining', 'Manage Stress', 'Build Confidence'
  ],

  'Writing': [
    'Write Book', 'Start Blog', 'Publish Articles', 'Create Poetry',
    'Write Screenplay', 'Keep Journal', 'Share Stories', 'Build Portfolio'
  ],
  'Visual Arts': [
    'Learn Painting', 'Master Photography', 'Create Digital Art', 'Study Design',
    'Practice Drawing', 'Make Films', 'Build Portfolio', 'Sell Art'
  ],
  'Music': [
    'Learn Piano', 'Master Guitar', 'Write Songs', 'Record Album',
    'Join Band', 'Perform Live', 'Study Theory', 'Create Music'
  ],
  'Performance': [
    'Learn Acting', 'Do Stand-up', 'Dance Performance', 'Join Theater',
    'Master Voice', 'Build Presence', 'Create Show', 'Perform Live'
  ],

  'Sustainability': [
    'Reduce Waste', 'Go Zero Waste', 'Use Renewables', 'Conserve Water',
    'Eat Sustainable', 'Green Transport', 'Plant Garden', 'Reduce Plastic'
  ],
  'Conservation': [
    'Save Energy', 'Protect Wildlife', 'Clean Environment', 'Support Causes',
    'Reduce Footprint', 'Plant Trees', 'Save Water', 'Promote Change'
  ],
  'Eco-Living': [
    'Live Minimally', 'Buy Local', 'Use Eco Products', 'Create Compost',
    'Reduce Consumption', 'Reuse Items', 'Shop Ethically', 'Learn Sustainability'
  ],
  'Community Green': [
    'Start Initiative', 'Lead Projects', 'Educate Others', 'Build Programs',
    'Create Gardens', 'Clean Areas', 'Organize Events', 'Make Impact'
  ],
};

const AVOID_GOAL_CATEGORIES = {
  // Digital & Technology
  'Social Media Addiction': [
    'Stop Endless Scrolling', 'Quit Instagram Addiction', 'Reduce Facebook Usage', 'Stop Twitter Obsession',
    'Limit TikTok Time', 'Avoid Social Media Comparison', 'Stop Social Media Before Bed', 'Quit Social Media Drama'
  ],
  'Gaming Issues': [
    'Reduce Gaming Hours', 'Stop Gaming Addiction', 'Limit Mobile Gaming', 'Quit Late Night Gaming',
    'Stop Impulsive Gaming Purchases', 'Avoid Gaming Rage', 'Control Gaming Time', 'Stop Gaming Procrastination'
  ],
  'Digital Distractions': [
    'Stop Phone Checking', 'Reduce Screen Time', 'Quit YouTube Binging', 'Stop Email Addiction',
    'Limit Netflix Binging', 'Avoid Digital Multitasking', 'Stop Tech Overuse', 'Control App Notifications'
  ],
  'Online Shopping': [
    'Stop Impulse Buying', 'Quit Online Shopping Addiction', 'Reduce Amazon Purchases', 'Stop Late Night Shopping',
    'Avoid Shopping When Stressed', 'Control Shopping Urges', 'Stop Unnecessary Purchases', 'Limit Online Browsing'
  ],

  // Health & Wellness
  'Eating Habits': [
    'Stop Overeating', 'Quit Emotional Eating', 'Reduce Fast Food', 'Stop Late Night Snacking',
    'Avoid Stress Eating', 'Control Portion Sizes', 'Stop Mindless Eating', 'Quit Binge Eating'
  ],
  'Sleep Issues': [
    'Stop Late Night Screen Time', 'Quit Irregular Sleep', 'Reduce Caffeine Before Bed', 'Stop All-Nighters',
    'Avoid Sleep Procrastination', 'Control Nap Length', 'Stop Weekend Sleep Changes', 'Quit Sleep Disruptions'
  ],
  'Exercise Avoidance': [
    'Stop Skipping Workouts', 'Quit Sedentary Lifestyle', 'Reduce Sitting Time', 'Stop Exercise Excuses',
    'Avoid Workout Procrastination', 'Control Exercise Resistance', 'Stop Gym Avoidance', 'Quit Exercise Laziness'
  ],
  'Mental Health': [
    'Stop Negative Self-Talk', 'Quit Anxiety Spirals', 'Reduce Stress Triggers', 'Stop Depression Habits',
    'Avoid Mental Health Stigma', 'Control Panic Attacks', 'Stop Mental Health Neglect', 'Quit Unhealthy Coping'
  ],

  // Work & Productivity
  'Work Procrastination': [
    'Stop Task Delays', 'Quit Last-Minute Rush', 'Reduce Work Avoidance', 'Stop Deadline Stress',
    'Avoid Project Delays', 'Control Time Wasting', 'Stop Work Postponement', 'Quit Procrastination Habits'
  ],
  'Email Management': [
    'Stop Email Overload', 'Quit Constant Checking', 'Reduce Email Distractions', 'Stop Email Hoarding',
    'Avoid Email Anxiety', 'Control Inbox Chaos', 'Stop Email Procrastination', 'Quit Email Addiction'
  ],
  'Meeting Behavior': [
    'Stop Meeting Overload', 'Quit Unnecessary Meetings', 'Reduce Meeting Length', 'Stop Meeting Multitasking',
    'Avoid Unnecessary Meetings', 'Control Meeting Schedule', 'Stop Meeting Waste', 'Quit Meeting Addiction'
  ],
  'Work-Life Balance': [
    'Stop Overworking', 'Quit Weekend Work', 'Reduce After-Hours Emails', 'Stop Work Obsession',
    'Avoid Burnout', 'Control Work Stress', 'Stop Work-Life Blur', 'Quit Vacation Avoidance'
  ],

  // Financial Habits
  'Spending Habits': [
    'Stop Overspending', 'Quit Impulse Purchases', 'Reduce Unnecessary Expenses', 'Stop Credit Card Abuse',
    'Avoid Debt Accumulation', 'Control Shopping Addiction', 'Stop Financial Stress', 'Quit Money Waste'
  ],
  'Financial Planning': [
    'Stop Budget Neglect', 'Quit Financial Avoidance', 'Reduce Money Stress', 'Stop Investment Procrastination',
    'Avoid Financial Risks', 'Control Spending Urges', 'Stop Savings Neglect', 'Quit Financial Denial'
  ],
  'Debt Management': [
    'Stop New Debt', 'Quit Credit Card Dependence', 'Reduce Interest Payments', 'Stop Loan Defaults',
    'Avoid Debt Collectors', 'Control Debt Stress', 'Stop Payment Delays', 'Quit Debt Denial'
  ],
  'Gambling': [
    'Stop Gambling Urges', 'Quit Betting Addiction', 'Reduce Gaming Stakes', 'Stop Casino Visits',
    'Avoid Gambling Triggers', 'Control Betting Impulses', 'Stop Sports Betting', 'Quit Online Gambling'
  ],

  // Relationship Issues
  'Communication Problems': [
    'Stop Silent Treatment', 'Quit Passive Aggression', 'Reduce Arguments', 'Stop Interrupting',
    'Avoid Communication Blocks', 'Control Angry Responses', 'Stop Defensive Behavior', 'Quit Poor Listening'
  ],
  'Toxic Relationships': [
    'Stop Enabling', 'Quit Toxic Friends', 'Reduce Drama', 'Stop Codependency',
    'Avoid Manipulative People', 'Control Boundary Issues', 'Stop People Pleasing', 'Quit Unhealthy Relationships'
  ],
  'Social Anxiety': [
    'Stop Social Avoidance', 'Quit Isolation', 'Reduce Social Fear', 'Stop Self-Consciousness',
    'Avoid Social Withdrawal', 'Control Social Anxiety', 'Stop Social Overthinking', 'Quit Social Comparison'
  ],
  'Family Conflicts': [
    'Stop Family Drama', 'Quit Family Feuds', 'Reduce Family Tension', 'Stop Sibling Rivalry',
    'Avoid Family Gossip', 'Control Family Stress', 'Stop Parent Conflicts', 'Quit Family Avoidance'
  ],

  // Personal Development
  'Self-Sabotage': [
    'Stop Self-Defeat', 'Quit Negative Self-Talk', 'Reduce Self-Criticism', 'Stop Imposter Syndrome',
    'Avoid Self-Doubt', 'Control Self-Sabotage', 'Stop Fear of Success', 'Quit Self-Limitation'
  ],
  'Learning Blocks': [
    'Stop Study Procrastination', 'Quit Learning Avoidance', 'Reduce Study Distractions', 'Stop Exam Anxiety',
    'Avoid Learning Blocks', 'Control Study Stress', 'Stop Academic Fear', 'Quit Learning Resistance'
  ],
  'Time Management': [
    'Stop Time Wasting', 'Quit Poor Planning', 'Reduce Time Stress', 'Stop Schedule Chaos',
    'Avoid Time Pressure', 'Control Time Management', 'Stop Time Anxiety', 'Quit Time Procrastination'
  ],
  'Goal Setting': [
    'Stop Goal Avoidance', 'Quit Goal Abandonment', 'Reduce Goal Overwhelm', 'Stop Goal Procrastination',
    'Avoid Goal Confusion', 'Control Goal Stress', 'Stop Goal Fear', 'Quit Goal Sabotage'
  ],

  // Substance & Addiction
  'Smoking Habits': [
    'Stop Cigarette Smoking', 'Quit Vaping', 'Reduce Nicotine Dependency', 'Stop Social Smoking',
    'Avoid Smoking Triggers', 'Control Smoking Urges', 'Stop Second-Hand Smoke', 'Quit Tobacco Products'
  ],
  'Alcohol Use': [
    'Stop Binge Drinking', 'Quit Daily Drinking', 'Reduce Alcohol Intake', 'Stop Drunk Texting',
    'Avoid Alcohol Triggers', 'Control Drinking Urges', 'Stop Social Drinking', 'Quit Alcohol Dependency'
  ],
  'Caffeine Dependency': [
    'Stop Coffee Addiction', 'Quit Energy Drinks', 'Reduce Caffeine Intake', 'Stop Late Coffee',
    'Avoid Caffeine Crashes', 'Control Coffee Urges', 'Stop Caffeine Anxiety', 'Quit Caffeine Dependency'
  ],
  'Drug Use': [
    'Stop Substance Use', 'Quit Drug Dependency', 'Reduce Drug Cravings', 'Stop Drug-Seeking',
    'Avoid Drug Triggers', 'Control Drug Urges', 'Stop Drug-Related Behavior', 'Quit Drug Habits'
  ],

  // Environmental Impact
  'Waste Generation': [
    'Stop Single-Use Plastics', 'Quit Excessive Packaging', 'Reduce Waste', 'Stop Food Waste',
    'Avoid Disposable Items', 'Control Consumption', 'Stop Littering', 'Quit Wasteful Habits'
  ],
  'Energy Waste': [
    'Stop Energy Waste', 'Quit Excessive AC Use', 'Reduce Power Consumption', 'Stop Leaving Lights On',
    'Avoid Energy Inefficiency', 'Control Utility Bills', 'Stop Resource Waste', 'Quit Energy-Wasting Habits'
  ],
  'Water Waste': [
    'Stop Water Waste', 'Quit Long Showers', 'Reduce Water Usage', 'Stop Leaky Faucets',
    'Avoid Water Inefficiency', 'Control Water Bills', 'Stop Running Taps', 'Quit Water-Wasting Habits'
  ],
  'Transportation Impact': [
    'Stop Single-Car Trips', 'Quit Unnecessary Driving', 'Reduce Car Usage', 'Stop Idling',
    'Avoid Traffic Times', 'Control Fuel Usage', 'Stop Carbon Emissions', 'Quit Car Dependency'
  ],

  // Physical Health
  'Posture Problems': [
    'Stop Slouching', 'Quit Poor Posture', 'Reduce Sitting Time', 'Stop Phone Neck',
    'Avoid Back Strain', 'Control Desk Posture', 'Stop Shoulder Tension', 'Quit Bad Ergonomics'
  ],
  'Eye Strain': [
    'Stop Screen Strain', 'Quit Close Reading', 'Reduce Screen Time', 'Stop Eye Fatigue',
    'Avoid Eye Stress', 'Control Screen Distance', 'Stop Night Mode Avoidance', 'Quit Eye-Straining Habits'
  ],
  'Dental Habits': [
    'Stop Teeth Grinding', 'Quit Sugar Consumption', 'Reduce Acidic Drinks', 'Stop Late Night Snacking',
    'Avoid Dental Neglect', 'Control Sweet Cravings', 'Stop Poor Brushing', 'Quit Dental Procrastination'
  ],
  'Physical Inactivity': [
    'Stop Desk Sitting', 'Quit Elevator Use', 'Reduce Inactive Time', 'Stop Movement Avoidance',
    'Avoid Physical Laziness', 'Control Sedentary Behavior', 'Stop Exercise Excuses', 'Quit Inactivity'
  ],

  // Mental Patterns
  'Overthinking': [
    'Stop Racing Thoughts', 'Quit Rumination', 'Reduce Thought Loops', 'Stop Analysis Paralysis',
    'Avoid Mental Spirals', 'Control Overthinking', 'Stop Excessive Planning', 'Quit Mental Overload'
  ],
  'Perfectionism': [
    'Stop Perfect Standards', 'Quit Overanalysis', 'Reduce Perfectionist Tendencies', 'Stop Self-Criticism',
    'Avoid Perfection Paralysis', 'Control High Standards', 'Stop Perfectionist Delays', 'Quit Perfect Seeking'
  ],
  'Negative Self-Image': [
    'Stop Self-Criticism', 'Quit Body Shame', 'Reduce Negative Talk', 'Stop Comparison',
    'Avoid Self-Hate', 'Control Self-Image', 'Stop Mirror Checking', 'Quit Appearance Obsession'
  ],
  'Anxiety Patterns': [
    'Stop Anxiety Spirals', 'Quit Worry Cycles', 'Reduce Panic Triggers', 'Stop Anxiety Avoidance',
    'Avoid Anxiety Foods', 'Control Anxiety Thoughts', 'Stop Anxiety Behaviors', 'Quit Anxiety Habits'
  ],

  // Social Media & Technology
  'Phone Addiction': [
    'Stop Phone Checking', 'Quit Notification Addiction', 'Reduce Screen Time', 'Stop Phone During Meals',
    'Avoid Phone in Bed', 'Control App Usage', 'Stop Phone Dependency', 'Quit Phone Obsession'
  ],
  'Social Media Comparison': [
    'Stop Social Comparison', 'Quit Instagram Envy', 'Reduce FOMO', 'Stop Status Anxiety',
    'Avoid Social Pressure', 'Control Social Media', 'Stop Validation Seeking', 'Quit Online Comparison'
  ],
  'Digital Hoarding': [
    'Stop File Hoarding', 'Quit Email Hoarding', 'Reduce Digital Clutter', 'Stop Photo Hoarding',
    'Avoid Data Accumulation', 'Control Digital Space', 'Stop Download Hoarding', 'Quit Digital Mess'
  ],
  'Tech Distractions': [
    'Stop Tech Interruptions', 'Quit App Switching', 'Reduce Notifications', 'Stop Digital Noise',
    'Avoid Tech Overload', 'Control Device Use', 'Stop Tech Multitasking', 'Quit Digital Distraction'
  ],

  // Workplace Behaviors
  'Office Politics': [
    'Stop Office Gossip', 'Quit Workplace Drama', 'Reduce Political Games', 'Stop Backstabbing',
    'Avoid Office Conflicts', 'Control Work Relations', 'Stop Power Struggles', 'Quit Toxic Work Culture'
  ],
  'Meeting Habits': [
    'Stop Meeting Lateness', 'Quit Meeting Overload', 'Reduce Meeting Time', 'Stop Meeting Multitasking',
    'Avoid Unnecessary Meetings', 'Control Meeting Schedule', 'Stop Meeting Waste', 'Quit Meeting Addiction'
  ],
  'Work Communication': [
    'Stop Email Overload', 'Quit Poor Communication', 'Reduce Message Chaos', 'Stop Communication Gaps',
    'Avoid Mixed Messages', 'Control Information Flow', 'Stop Communication Delays', 'Quit Message Confusion'
  ],
  'Career Mistakes': [
    'Stop Career Stagnation', 'Quit Job Hopping', 'Reduce Career Risks', 'Stop Skill Neglect',
    'Avoid Career Mistakes', 'Control Career Path', 'Stop Professional Laziness', 'Quit Career Procrastination'
  ],

  // Academic Issues
  'Study Habits': [
    'Stop Cramming', 'Quit Last-Minute Study', 'Reduce Study Stress', 'Stop Study Procrastination',
    'Avoid Study Distractions', 'Control Study Schedule', 'Stop Study Anxiety', 'Quit Poor Study Habits'
  ],
  'Academic Pressure': [
    'Stop Grade Obsession', 'Quit Academic Stress', 'Reduce Test Anxiety', 'Stop Performance Pressure',
    'Avoid Academic Burnout', 'Control Study Pressure', 'Stop Grade Anxiety', 'Quit Academic Perfectionism'
  ],
  'Learning Blocks': [
    'Stop Learning Resistance', 'Quit Subject Avoidance', 'Reduce Learning Anxiety', 'Stop Skill Blocks',
    'Avoid Learning Fears', 'Control Study Blocks', 'Stop Learning Procrastination', 'Quit Learning Barriers'
  ],
  'Academic Integrity': [
    'Stop Plagiarism', 'Quit Academic Dishonesty', 'Reduce Citation Errors', 'Stop Cheating',
    'Avoid Academic Misconduct', 'Control Research Ethics', 'Stop Citation Neglect', 'Quit Academic Shortcuts'
  ],

  // Financial Behaviors
  'Money Management': [
    'Stop Money Waste', 'Quit Financial Chaos', 'Reduce Money Stress', 'Stop Budget Neglect',
    'Avoid Money Problems', 'Control Spending', 'Stop Financial Anxiety', 'Quit Money Mistakes'
  ],
  'Shopping Behavior': [
    'Stop Impulse Buying', 'Quit Shopping Addiction', 'Reduce Unnecessary Purchases', 'Stop Retail Therapy',
    'Avoid Shopping Triggers', 'Control Buying Urges', 'Stop Shopping Stress', 'Quit Shopping Habits'
  ],
  'Debt Accumulation': [
    'Stop New Debt', 'Quit Credit Cards', 'Reduce Loan Taking', 'Stop Debt Cycle',
    'Avoid Debt Traps', 'Control Borrowing', 'Stop Debt Stress', 'Quit Debt Accumulation'
  ],
  'Investment Mistakes': [
    'Stop Risky Trading', 'Quit Market Timing', 'Reduce Investment Errors', 'Stop Emotional Investing',
    'Avoid Investment FOMO', 'Control Trading Urges', 'Stop Investment Gambling', 'Quit Poor Investment Choices'
  ],

  // Relationship Patterns
  'Dating Mistakes': [
    'Stop Dating Games', 'Quit Toxic Dating', 'Reduce Dating Anxiety', 'Stop Relationship Rushing',
    'Avoid Dating Red Flags', 'Control Dating Impulses', 'Stop Dating Pressure', 'Quit Dating Mistakes'
  ],
  'Communication Issues': [
    'Stop Silent Treatment', 'Quit Passive Aggression', 'Reduce Arguments', 'Stop Poor Listening',
    'Avoid Communication Blocks', 'Control Angry Responses', 'Stop Mixed Messages', 'Quit Communication Problems'
  ],
  'Boundary Problems': [
    'Stop People Pleasing', 'Quit Boundary Violations', 'Reduce Over-Commitment', 'Stop Saying Yes',
    'Avoid Boundary Issues', 'Control Personal Space', 'Stop Emotional Drainage', 'Quit Boundary Crossing'
  ],
  'Social Media Impact': [
    'Stop Social Comparison', 'Quit Online Drama', 'Reduce Digital Jealousy', 'Stop Social Media Fights',
    'Avoid Online Toxicity', 'Control Social Media', 'Stop Digital Drama', 'Quit Social Media Stress'
  ],

  // Personal Growth Blockers
  'Self-Development': [
    'Stop Growth Resistance', 'Quit Comfort Zone', 'Reduce Fear of Change', 'Stop Self-Limitation',
    'Avoid Growth Blocks', 'Control Fear of Success', 'Stop Personal Stagnation', 'Quit Growth Fear'
  ],
  'Creativity Blocks': [
    'Stop Creative Blocks', 'Quit Artistic Fear', 'Reduce Creative Anxiety', 'Stop Perfectionism',
    'Avoid Creative Judgment', 'Control Creative Fear', 'Stop Art Blocks', 'Quit Creative Resistance'
  ],
  'Emotional Patterns': [
    'Stop Emotional Eating', 'Quit Mood Swings', 'Reduce Emotional Reactivity', 'Stop Emotional Suppression',
    'Avoid Emotional Triggers', 'Control Emotional Responses', 'Stop Emotional Avoidance', 'Quit Emotional Habits'
  ],
  'Spiritual Blocks': [
    'Stop Spiritual Doubt', 'Quit Faith Crisis', 'Reduce Spiritual Anxiety', 'Stop Religious Guilt',
    'Avoid Spiritual Confusion', 'Control Religious Pressure', 'Stop Faith Struggles', 'Quit Spiritual Blocks'
  ],

  // Environmental & Lifestyle
  'Home Habits': [
    'Stop House Clutter', 'Quit Messy Rooms', 'Reduce Home Chaos', 'Stop Cleaning Procrastination',
    'Avoid Home Disorder', 'Control House Mess', 'Stop Organizing Delays', 'Quit Cluttering Habits'
  ],
  'Food Waste': [
    'Stop Food Spoilage', 'Quit Overbuying Food', 'Reduce Meal Waste', 'Stop Expired Food',
    'Avoid Food Hoarding', 'Control Grocery Excess', 'Stop Food Throwing', 'Quit Food Waste'
  ],
  'Time Waste': [
    'Stop Time Killing', 'Quit Time Wasters', 'Reduce Time Leaks', 'Stop Schedule Chaos',
    'Avoid Time Drains', 'Control Time Usage', 'Stop Time Theft', 'Quit Time Waste'
  ],
  'Energy Consumption': [
    'Stop Energy Waste', 'Quit Power Overuse', 'Reduce Electricity Waste', 'Stop Resource Waste',
    'Avoid Energy Drain', 'Control Power Usage', 'Stop Utility Waste', 'Quit Energy Overconsumption'
  ]
};

interface FormData {
  title: string;
  description: string;
  targets: Target[];
  endDate: string;
  type: 'do' | 'dont';
  category: string;
}

interface Target {
  value: number;
  description: string;
  unit: string;
  completed: boolean;
}

interface GoalFormProps {
  initialData?: Goal;
  onSave: (data: Partial<Goal>) => void;
  onClose: () => void;
}

export function GoalForm({ initialData, onSave, onClose }: GoalFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    targets: initialData?.targets || [],
    endDate: initialData?.endDate || new Date().toISOString(),
    type: initialData?.type || 'do',
    category: initialData?.category || Object.keys(GOAL_CATEGORIES)[0]
  });

  const [showTargetForm, setShowTargetForm] = useState(false);
  const [targetData, setTargetData] = useState<Target>({
    value: 0,
    description: '',
    unit: '',
    completed: false
  });

  const [open, setOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<Record<string, string[]>>({});
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryGoals, setNewCategoryGoals] = useState<string[]>([]);
  const [newGoalInput, setNewGoalInput] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const goalData: Partial<Goal> = {
      title: formData.title,
      description: formData.description,
      targets: formData.targets,
      endDate: formData.endDate,
      type: formData.type,
      category: formData.category
    };

    onSave(goalData);
  };

  const getCategories = () => {
    return formData.type === 'do' ? GOAL_CATEGORIES : { ...AVOID_GOAL_CATEGORIES, ...customCategories };
  };

  const handleTypeChange = (newType: 'do' | 'dont') => {
    const categories = newType === 'do' ? GOAL_CATEGORIES : AVOID_GOAL_CATEGORIES;
    const firstCategory = Object.keys(categories)[0];
    setFormData({ 
      ...formData, 
      type: newType,
      category: firstCategory // Reset category when type changes
    });
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && newCategoryGoals.length > 0) {
      const updatedCategories = {
        ...customCategories,
        [newCategoryName]: newCategoryGoals
      };
      setCustomCategories(updatedCategories);
      setIsAddingCategory(false);
      setNewCategoryName('');
      setNewCategoryGoals([]);
      setNewGoalInput('');
    }
  };

  const handleAddGoalToCategory = () => {
    if (newGoalInput.trim()) {
      setNewCategoryGoals([...newCategoryGoals, newGoalInput.trim()]);
      setNewGoalInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter your goal title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your goal in detail..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Targets</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowTargetForm(true);
                setTargetData({
                  value: 0,
                  description: '',
                  unit: '',
                  completed: false
                });
              }}
            >
              Add Target
            </Button>
          </div>

          {formData.targets.length > 0 ? (
            <div className="space-y-2">
              {formData.targets.map((target, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-accent/10"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {target.value} {target.unit}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {target.description}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newTargets = formData.targets.filter((_, i) => i !== index);
                      setFormData({ ...formData, targets: newTargets });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border rounded-lg text-muted-foreground">
              No targets added yet. Click "Add Target" to set your first target.
            </div>
          )}

          <Dialog open={showTargetForm} onOpenChange={setShowTargetForm}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Target</DialogTitle>
                <DialogDescription>
                  Set a specific, measurable target for your goal.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      type="number"
                      value={targetData.value}
                      onChange={(e) => setTargetData({
                        ...targetData,
                        value: Number(e.target.value)
                      })}
                      placeholder="Enter value"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      type="text"
                      value={targetData.unit}
                      onChange={(e) => setTargetData({
                        ...targetData,
                        unit: e.target.value
                      })}
                      placeholder="e.g., pages, hours"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={targetData.description}
                    onChange={(e) => setTargetData({
                      ...targetData,
                      description: e.target.value
                    })}
                    placeholder="Describe what this target means"
                    className="h-20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTargetForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (targetData.value && targetData.unit) {
                      setFormData({
                        ...formData,
                        targets: [...formData.targets, targetData]
                      });
                      setShowTargetForm(false);
                    }
                  }}
                  disabled={!targetData.value || !targetData.unit}
                >
                  Add Target
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Label>Category</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingCategory(true)}
              className="text-primary"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Category
            </Button>
          </div>

          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {Object.keys(getCategories()).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category and add goals to it.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Goals in Category</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newGoalInput}
                      onChange={(e) => setNewGoalInput(e.target.value)}
                      placeholder="Enter a goal"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddGoalToCategory();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddGoalToCategory}>
                      Add Goal
                    </Button>
                  </div>
                  <div className="mt-2">
                    {newCategoryGoals.map((goal, index) => (
                      <Badge key={index} className="m-1">
                        {goal}
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer"
                          onClick={() => {
                            setNewCategoryGoals(newCategoryGoals.filter((_, i) => i !== index));
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategoryName('');
                    setNewCategoryGoals([]);
                    setNewGoalInput('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleAddCategory} 
                  disabled={!newCategoryName.trim() || newCategoryGoals.length === 0}
                >
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value as 'do' | 'dont')}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="do">Achieve</option>
            <option value="dont">Avoid</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <DatePicker
            name="endDate"
            value={formData.endDate}
            onChange={(date) => setFormData({ ...formData, endDate: date })}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            Save Goal
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
