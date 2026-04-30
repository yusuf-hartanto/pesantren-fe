import React, { useRef, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Grid, Button,
  TextField, RadioGroup, FormControlLabel, Radio, Box
} from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const QrPrintModal = ({ open, onClose, data }: { open: boolean, onClose: () => void, data: any }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 80, h: 80 });

  // --- LOGIKA PROPORSI DINAMIS (DIKALIBRASI ULANG) ---
  const isSmall = size.w < 60;
  const dynamicPadding = isSmall ? 2 : 4;

  // Logo: Diperkecil sedikit rasionya
  const logoSize = isSmall
    ? Math.min(Math.max(size.w * 0.15, 7), 10)
    : Math.min(Math.max(size.w * 0.20, 12), 35);

  // Font Header (Pesantren Asshiddiqiyah): Diturunkan rasionya
  const fontSizeHeader = isSmall
    ? Math.min(Math.max(size.w * 0.045, 1.8), 2.8)
    : Math.min(Math.max(size.w * 0.05, 3), 6);

  // Font Nama Lokasi: Diturunkan agar tidak mendominasi
  const fontSizeMain = isSmall
    ? Math.min(Math.max(size.w * 0.06, 2.5), 3.8)
    : Math.min(Math.max(size.w * 0.07, 4), 9);

  // Font Keterangan SADA
  const fontSizeFooterNote = isSmall
    ? Math.min(Math.max(size.w * 0.035, 1.5), 2.5)
    : Math.min(Math.max(size.w * 0.04, 2.5), 5);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `QR_${data?.kode_lokasi}`,
  });

  const handleDownload = async () => {
    const element = contentRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', [size.w, size.h]);
    pdf.addImage(imgData, 'PNG', 0, 0, size.w, size.h);
    pdf.save(`QR_${data?.kode_lokasi}.pdf`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <style>{`
        @media print {
          @page { size: ${size.w}mm ${size.h}mm; margin: 0; }
          body { margin: 0; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <DialogTitle>Preview Cetak QR Code</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <RadioGroup row onChange={(e) => {
              const val = e.target.value;
              if (val === 'A6') setSize({ w: 105, h: 148 });
              else if (val === 'A7') setSize({ w: 74, h: 105 });
              else if (val === 'Sticker') setSize({ w: 50, h: 50 });
            }}>
              <FormControlLabel value="A6" control={<Radio />} label="A6" />
              <FormControlLabel value="A7" control={<Radio />} label="A7" />
              <FormControlLabel value="Sticker" control={<Radio />} label="Sticker" />
              <FormControlLabel value="Custom" control={<Radio />} label="Custom" />
            </RadioGroup>
          </Grid>
          <Grid item xs={6}><TextField fullWidth label="L (mm)" type="number" value={size.w} onChange={(e) => setSize({ ...size, w: Number(e.target.value) })} /></Grid>
          <Grid item xs={6}><TextField fullWidth label="T (mm)" type="number" value={size.h} onChange={(e) => setSize({ ...size, h: Number(e.target.value) })} /></Grid>
        </Grid>

        <Box sx={{ backgroundColor: '#ddd', p: 2, mt: 2, display: 'flex', justifyContent: 'center' }}>
          <div
            ref={contentRef}
            style={{
              width: `${size.w}mm`,
              height: `${size.h}mm`,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${dynamicPadding}mm`,
              boxSizing: 'border-box',
              color: '#000',
              textAlign: 'center',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ width: '100%', flexShrink: 0 }}>
              <div style={{
                width: `${logoSize}mm`, height: `${logoSize}mm`,
                borderRadius: '50%', backgroundColor: '#2e7d32', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: `${logoSize * 0.6}mm`, fontWeight: 'bold',
                margin: '0 auto 1mm auto', lineHeight: 0
              }}>P</div>
              <div style={{ fontSize: `${fontSizeHeader}mm`, fontWeight: 'bold', textTransform: 'uppercase', lineHeight: 1.2 }}>
                Pesantren Asshiddiqiyah
              </div>
            </div>

            {/* QR Area */}
            <div style={{
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 0,
              margin: '1mm 0'
            }}>
              {data?.qr_code_base64 ? (
                <img src={data.qr_code_base64} alt="QR" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '10mm', height: '10mm', backgroundColor: '#eee' }} />
              )}
            </div>

            {/* Footer */}
            <div style={{ width: '100%', borderTop: '0.2mm solid #000', paddingTop: '1mm', flexShrink: 0 }}>
              <div style={{ fontSize: `${fontSizeMain}mm`, fontWeight: 'bold', lineHeight: 1.1 }}>
                {data?.nama_lokasi}
              </div>
              <div style={{ fontSize: `${fontSizeFooterNote * 1.1}mm`, fontFamily: 'monospace', margin: '0.2mm 0' }}>
                {data?.kode_lokasi}
              </div>
              <div style={{
                fontSize: `${fontSizeFooterNote}mm`,
                fontStyle: 'italic',
                color: '#555',
                marginTop: '0.5mm',
                lineHeight: 1
              }}>
                Scan untuk inspeksi sistem SADA
              </div>
            </div>
          </div>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="center">
          <Grid item><Button variant="outlined" onClick={onClose}>Batal</Button></Grid>
          <Grid item><Button variant="contained" onClick={handleDownload}>PDF</Button></Grid>
          <Grid item><Button variant="contained" onClick={handlePrint} color="success">Cetak</Button></Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default QrPrintModal;
