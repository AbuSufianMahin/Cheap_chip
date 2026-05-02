"use client";

import axiosPublic from "@/lib/axiosPublic";
import { useEffect, useState } from "react";

const FILTERS = ["all", "technician", "delivery", "pending", "approved", "declined"];

const STATUS_STYLES = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  declined: "border-rose-200 bg-rose-50 text-rose-800",
};

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AttachmentThumbnail({ src, alt, label }) {
  if (!src) {
    return null;
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300"
    >
      <div className="border-b border-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
        {label}
      </div>
      <img
        src={src}
        alt={alt}
        className="h-40 w-full object-cover transition duration-200 group-hover:scale-[1.02]"
      />
    </a>
  );
}

function getApplicationAttachments(application) {
  const attachments = [];

  if (application.drivingLicensePicture) {
    attachments.push({
      src: application.drivingLicensePicture,
      label: "Driving License Picture",
      alt: `${application.name} driving license`,
    });
  }

  if (Array.isArray(application.certificationPictures)) {
    application.certificationPictures.forEach((source, index) => {
      if (!source) {
        return;
      }

      attachments.push({
        src: source,
        label: `Certificate ${index + 1}`,
        alt: `${application.name} certificate ${index + 1}`,
      });
    });
  }

  return attachments;
}

function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosPublic.get("/api/admin/job-applications");
      const payload = await response.data;

      if (!response.status) {
        throw new Error(payload.message || "Failed to load applications");
      }

      setApplications(payload.applications || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateApplication = async (application, status) => {
    try {
      setSavingId(application.id);
      setError("");

      const response = await fetch("/api/admin/job-applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationType: application.applicationType,
          applicationId: application.id,
          status,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to update application");
      }

      setApplications((currentApplications) =>
        currentApplications.map((currentApplication) =>
          currentApplication.id === application.id ? payload.application : currentApplication,
        ),
      );
    } catch (updateError) {
      setError(updateError.message || "Failed to update application");
    } finally {
      setSavingId(null);
    }
  };

  const filteredApplications = applications.filter((application) => {
    if (filter === "all") {
      return true;
    }

    if (filter === "technician" || filter === "delivery") {
      return application.applicationType === filter;
    }

    return application.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Applications Review</h1>
        <p className="text-sm text-slate-600">
          Review technician and delivery applications, then approve or decline each submission.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              filter === item
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading applications...
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
          No applications match the selected filter.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredApplications.map((application) => (
            <article key={application.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {(() => {
                const attachments = getApplicationAttachments(application);

                return (
                  <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {application.applicationType} application
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{application.name}</h2>
                  <p className="text-sm text-slate-600">{application.email || "No email provided"}</p>
                  <p className="text-sm text-slate-600">{application.location}</p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                    STATUS_STYLES[application.status] || "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  {application.status}
                </span>
              </div>

              <dl className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Mobile Number</dt>
                  <dd className="font-medium text-slate-900">{application.mobileNumber}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Submitted</dt>
                  <dd className="font-medium text-slate-900">{formatDate(application.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">ID Proof</dt>
                  <dd className="font-medium text-slate-900">{application.idProof || "Not provided"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Reviewed At</dt>
                  <dd className="font-medium text-slate-900">{formatDate(application.reviewedAt)}</dd>
                </div>
              </dl>

              {application.applicationType === "technician" ? (
                <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div>
                    <p className="text-slate-500">Skills</p>
                    <p className="font-medium text-slate-900">{application.skills}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Certificates</p>
                    <p className="font-medium text-slate-900">{application.certificates}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Certificate Images</p>
                    <p className="font-medium text-slate-900">
                      {application.certificationPictures?.length ? `${application.certificationPictures.length} file(s)` : "None"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="text-slate-500">Driving License</p>
                  <p className="font-medium text-slate-900">{application.drivingLicense}</p>
                  <p className="mt-2 text-slate-500">Driving License Picture</p>
                  <p className="font-medium text-slate-900">
                    {application.drivingLicensePicture ? "Available" : "Not provided"}
                  </p>
                </div>
              )}

              <div className="mt-5 space-y-3">
                <p className="text-sm font-medium text-slate-700">Attached Pictures</p>
                {attachments.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {attachments.map((attachment, index) => (
                      <AttachmentThumbnail
                        key={`${application.id}-attachment-${index}`}
                        src={attachment.src}
                        alt={attachment.alt}
                        label={attachment.label}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No pictures available</p>
                )}
              </div>

              {application.reviewedBy ? (
                <p className="mt-4 text-xs text-slate-500">Reviewed by {application.reviewedBy}</p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={savingId === application.id || application.status === "approved"}
                  onClick={() => updateApplication(application, "approved")}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingId === application.id ? "Saving..." : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={savingId === application.id || application.status === "declined"}
                  onClick={() => updateApplication(application, "declined")}
                  className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingId === application.id ? "Saving..." : "Decline"}
                </button>
              </div>
                  </>
                );
              })()}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminApplicationsPage;