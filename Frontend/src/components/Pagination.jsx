export default function Pagination({ page, setPage, totalPages }) {
    return (
        <div className="flex justify-center items-center gap-3 mt-4">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 bg-white/5 rounded">Prev</button>
            <span>{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 bg-white/5 rounded">Next</button>
        </div>
    );
}
