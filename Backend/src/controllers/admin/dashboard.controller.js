import { Enquiry } from '../../models/Enquiry.js';
import { Project } from '../../models/Project.js';
import { AnalyticsEvent } from '../../models/AnalyticsEvent.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ok } from '../../utils/ApiResponse.js';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const getDashboard = asyncHandler(async (req, res) => {
  const since30 = daysAgo(30);
  const since7 = daysAgo(7);

  const [
    statusCounts,
    totalEnquiries,
    enquiries30d,
    recentEnquiries,
    pageViews30d,
    ctaClicks30d,
    enquiryStarts30d,
    enquirySubmits30d,
    topProjectsAgg,
    overdueFollowUps,
    enquiryTrendAgg,
  ] = await Promise.all([
    Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Enquiry.countDocuments({}),
    Enquiry.countDocuments({ createdAt: { $gte: since30 } }),
    Enquiry.find({}).sort({ createdAt: -1 }).limit(8).select('contact projectType status createdAt').lean(),
    AnalyticsEvent.countDocuments({ type: 'page_view', createdAt: { $gte: since30 } }),
    AnalyticsEvent.countDocuments({ type: 'project_cta_click', createdAt: { $gte: since30 } }),
    AnalyticsEvent.countDocuments({ type: 'enquiry_start', createdAt: { $gte: since30 } }),
    AnalyticsEvent.countDocuments({ type: 'enquiry_submit', createdAt: { $gte: since30 } }),
    AnalyticsEvent.aggregate([
      { $match: { type: 'project_cta_click', createdAt: { $gte: since30 } } },
      { $group: { _id: '$path', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 5 },
    ]),
    Enquiry.countDocuments({
      followUpDate: { $lt: new Date() },
      status: { $nin: ['WON', 'LOST', 'PROJECT'] },
      archived: false,
    }),
    Enquiry.aggregate([
      { $match: { createdAt: { $gte: since30 } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const statusMap = statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
  const publishedProjects = await Project.countDocuments({ status: 'published' });

  const conversionRate =
    pageViews30d > 0 ? Number(((enquirySubmits30d / pageViews30d) * 100).toFixed(2)) : 0;

  ok(res, {
    kpis: {
      totalEnquiries,
      enquiries30d,
      enquiries7d: await Enquiry.countDocuments({ createdAt: { $gte: since7 } }),
      publishedProjects,
      pageViews30d,
      ctaClicks30d,
      enquiryStarts30d,
      enquirySubmits30d,
      conversionRate,
      overdueFollowUps,
    },
    statusBreakdown: statusMap,
    enquiryTrend: enquiryTrendAgg.map((d) => ({ date: d._id, count: d.count })),
    topProjectsByClicks: topProjectsAgg.map((p) => ({ path: p._id, clicks: p.clicks })),
    recentEnquiries,
  });
});
