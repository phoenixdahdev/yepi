import Link from "next/link";
import { requireAdmin } from "../../_lib/admin";
import { countByStatus, listApplications } from "../../_lib/application";
import { APPLICATION_STATUSES, type ApplicationStatus } from "../../_lib/schemas";
import { ADMIN_STATUS } from "../_status";

const fmt = new Intl.DateTimeFormat("en-ZA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Johannesburg",
});

function isStatus(v: string | undefined): v is ApplicationStatus {
  return Boolean(v) && (APPLICATION_STATUSES as readonly string[]).includes(v!);
}

export default async function AdminListPage({
  searchParams,
}: PageProps<"/admin">) {
  // Authorise before touching the database. The layout also guards, but Next
  // renders a layout and its page concurrently: relying on the layout alone
  // let this page query and stream applicant names to an unauthenticated
  // request before the layout's redirect landed.
  await requireAdmin();

  const params = await searchParams;
  const status = isStatus(params.status as string) ? (params.status as ApplicationStatus) : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;

  const [rows, counts] = await Promise.all([
    listApplications({ status, q }),
    countByStatus(),
  ]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const query = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    const merged = { status, q, ...next };
    for (const [k, v] of Object.entries(merged)) if (v) sp.set(k, v);
    const s = sp.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="type-label text-blue">Applications</p>
          <h1 className="type-display mt-3 text-h2">
            {total} {total === 1 ? "record" : "records"}
          </h1>
        </div>
        <a
          href={`/admin/export${status ? `?status=${status}` : ""}`}
          className="type-label rounded-full border border-border bg-white px-6 py-3 transition-colors hover:border-ring"
        >
          Download CSV
        </a>
      </div>

      {/* Plain GET form: filtering must work before JavaScript does. */}
      <form className="mt-8 flex flex-wrap gap-3" action="/admin">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, email, venture or location"
          aria-label="Search applications"
          className="min-w-64 flex-1 rounded-lg border border-input bg-white px-4 py-2.5 text-sm outline-none focus:border-ring"
        />
        <button
          type="submit"
          className="type-label rounded-full bg-navy px-6 py-3 text-white transition-colors hover:bg-blue"
        >
          Search
        </button>
      </form>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter by status">
        <Link
          href={query({ status: undefined })}
          className={`type-label rounded-full px-4 py-2 ${!status ? "bg-navy text-white" : "bg-white text-navy/70 hover:text-navy"}`}
        >
          All {total}
        </Link>
        {APPLICATION_STATUSES.filter((s) => counts[s]).map((s) => (
          <Link
            key={s}
            href={query({ status: s })}
            className={`type-label rounded-full px-4 py-2 ${status === s ? "bg-navy text-white" : "bg-white text-navy/70 hover:text-navy"}`}
          >
            {ADMIN_STATUS[s].label} {counts[s]}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="mt-14 rounded-2xl bg-white p-10 text-center text-body text-muted-foreground">
          Nothing matches that.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border">
              <tr className="type-label text-navy/55">
                <th className="px-5 py-4">Founder</th>
                <th className="px-5 py-4">Venture</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Progress</th>
                <th className="px-5 py-4">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => {
                const done = (["founder", "venture", "traction", "materials"] as const)
                  .filter((k) => r[k]).length;
                const badge = ADMIN_STATUS[r.status];
                return (
                  <tr key={r.id} className="hover:bg-mist/60">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/a/${r.id}`}
                        className="font-semibold text-navy underline-offset-4 hover:underline"
                      >
                        {r.founder?.fullName ?? "—"}
                      </Link>
                      <span className="block text-muted-foreground">
                        {r.founder?.email ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {r.venture?.ventureName ?? (
                        <span className="text-muted-foreground">—</span>
                      )}
                      <span className="block text-muted-foreground">
                        {r.venture?.location ?? ""}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`type-label rounded-full px-3 py-1 ${badge.tone}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{done}/4 steps</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {fmt.format(r.updatedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
