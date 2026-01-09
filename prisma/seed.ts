import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	const hashedPassword = await bcrypt.hash("password123", 10);

	const user = await prisma.user.upsert({
		where: { email: "demo@rooms.test" },
		update: { name: "Demo User" },
		create: {
			email: "demo@rooms.test",
			name: "Demo User",
			hashedPassword,
		},
	});

	const rooms = [
		{
			name: "Sala de Conferencias A",
			description: "Sala principal para reuniones grandes",
			capacity: 20,
			location: "Piso 1",
			amenities: ["Proyector", "Pizarra", "Video conferencia"],
		},
		{
			name: "Sala de Reuniones B",
			description: "Sala mediana ideal para equipos",
			capacity: 10,
			location: "Piso 2",
			amenities: ["TV", "Pizarra"],
		},
		{
			name: "Sala Creativa",
			description: "Espacio para brainstorming",
			capacity: 8,
			location: "Piso 2",
			amenities: ["Pizarra", "Post-its", "Marcadores"],
		},
		{
			name: "Sala Ejecutiva",
			description: "Sala privada para reuniones importantes",
			capacity: 6,
			location: "Piso 3",
			amenities: ["Proyector", "Video conferencia", "Café"],
		},
        {
			name: "Sala VIP",
			description: "Sala VIP para clientes especiales",
			capacity: 10,
			location: "Piso 4",
			amenities: ["Catering", "Servicio personalizado", "Vista panorámica"],
		},
	];

	await Promise.all(
		rooms.map((room) =>
			prisma.room.upsert({
				where: { name: room.name },
				update: room,
				create: room,
			})
		)
	);

	const start = new Date("2024-01-01T14:00:00Z");
	const end = new Date("2024-01-01T15:00:00Z");

	const room = await prisma.room.findUnique({ where: { name: "Sala de Conferencias A" } });

	if (room) {
		await prisma.reservation.upsert({
			where: { id: "demo-reservation" },
			update: {
				title: "Reserva de ejemplo",
				description: "Consulta de disponibilidad",
				startTime: start,
				endTime: end,
				userId: user.id,
				roomId: room.id,
			},
			create: {
				id: "demo-reservation",
				title: "Reserva de ejemplo",
				description: "Consulta de disponibilidad",
				startTime: start,
				endTime: end,
				userId: user.id,
				roomId: room.id,
			},
		});
	}
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
