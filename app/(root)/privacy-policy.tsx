import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useColorScheme } from "nativewind"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const LAST_UPDATED = "22 Agustus 2026"

export default function PrivacyPolicyScreen() {
  const router = useRouter()
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-4 gap-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? "#F9FAFB" : "#111827"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          Terakhir diperbarui: {LAST_UPDATED}
        </Text>

        <Section title="1. Data yang Kami Kumpulkan">
          Saat mendaftar dan menggunakan aplikasi ini, kami mengumpulkan:
          {"\n\n"}• Nama, alamat email, dan foto profil (melalui penyedia autentikasi Clerk)
          {"\n"}• Lokasi (koordinat) saat kamu memasang properti, jika kamu mengizinkan akses lokasi
          {"\n"}• Foto yang kamu unggah untuk listing properti
          {"\n"}• Data properti yang kamu buat atau simpan (harga, alamat, deskripsi)
          {"\n"}• Informasi teknis dasar (jenis perangkat, versi aplikasi) untuk keperluan debugging
        </Section>

        <Section title="2. Bagaimana Kami Menggunakan Data">
          Data yang dikumpulkan digunakan untuk:
          {"\n\n"}• Menampilkan dan mengelola listing properti
          {"\n"}• Personalisasi tampilan (termasuk preferensi mode gelap/terang)
          {"\n"}• Memberikan notifikasi terkait aktivitas akunmu
          {"\n"}• Meningkatkan kualitas dan keamanan aplikasi
        </Section>

        <Section title="3. Pihak Ketiga">
          Kami menggunakan layanan pihak ketiga berikut untuk mengoperasikan aplikasi:
          {"\n\n"}• Clerk — autentikasi dan manajemen akun
          {"\n"}• Supabase — penyimpanan database dan file gambar
          {"\n\n"}Kami tidak menjual data pribadimu kepada pihak ketiga mana pun untuk tujuan periklanan.
        </Section>

        <Section title="4. Penyimpanan & Keamanan">
          Data disimpan pada server Supabase dengan akses dibatasi melalui kebijakan keamanan (Row Level Security). Kami berupaya menjaga data pribadimu tetap aman, namun tidak ada sistem elektronik yang sepenuhnya bebas risiko.
        </Section>

        <Section title="5. Hak Pengguna">
          Kamu berhak untuk:
          {"\n\n"}• Mengakses dan memperbarui data profil melalui halaman Profile
          {"\n"}• Menghapus listing properti yang kamu buat
          {"\n"}• Meminta penghapusan akun beserta datanya dengan menghubungi kami
        </Section>

        <Section title="6. Perubahan Kebijakan">
          Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui aplikasi.
        </Section>

        <Section title="7. Kontak">
          Pertanyaan seputar privasi dapat dikirim ke:
          {"\n\n"}thorixrover@gmail.com
        </Section>
      </ScrollView>
    </SafeAreaView>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-base font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-300 leading-6">
        {children}
      </Text>
    </View>
  )
}