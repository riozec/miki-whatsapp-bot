import { command } from "../../utils";
import type { commandConfigurations } from "../../utils/typings/types";

const TEXTS: {
	[l in "id" | "en"]: {
		[k in Uppercase<commandConfigurations["metadata"]["category"]>]: Function;
	};
} = {
	id: {
		BOTSETTINGS: () => "BOT ๐พ",
		GAMES: () => "PERMAINAN ๐งฉ",
		GROUPTOOLS: () => "MANAJEMEN GRUP ๐ฅ",
		MEDIATOOLS: () => "ALAT MEDIA ๐ผ๏ธ",
		OTHERTOOLS: () => "PERALATAN LAINNYA โ๏ธ",
		OWNER: () => "PEMILIK BOT ๐",
		RANDOMFUN: () => "HIBURAN ACAK ๐ฒ",
	},
	en: {
		BOTSETTINGS: () => "BOT ๐พ",
		GAMES: () => "GAMES ๐งฉ",
		GROUPTOOLS: () => "GROUP MANAGEMENT ๐ฅ",
		MEDIATOOLS: () => "MEDIA TOOLS ๐ผ๏ธ",
		OTHERTOOLS: () => "OTHER TOOLS โ๏ธ",
		OWNER: () => "BOT OWNER ๐",
		RANDOMFUN: () => "RANDOM FUN ๐ฒ",
	},
};

command.new({
	onCommand: async (context) => {
		const hits = context.userData().out.stats.hits;
		const isOwner = context.isBotOwner().out;
		const language = context.language().out;
		const categories: { [k: string]: commandConfigurations["metadata"][] } = {};
		for (const cmd of command.listOfCommands) {
			if (cmd.metadata.permission.includes("owner") && !isOwner) continue;
			categories[cmd.metadata.category] ??= [];
			categories[cmd.metadata.category].push(cmd.metadata);
		}
		let str = "*Miki Bot Commands List* ๐";
		for (const category in categories) {
			str += "\n\nโ *" + TEXTS[language][category.toUpperCase() as Uppercase<commandConfigurations["metadata"]["category"]>]() + "*\nโ";
			for (const metadata of categories[category]) {
				const names = metadata.command;
				const otherName = metadata.locale.name?.[language];
				const premium = metadata.premium;
				for (const [idx, name] of Object.entries(names)) {
					if (idx === "0") {
						str += "\n" + (hits[name] ? "โ" : "โ") + ` */${name}*` + (otherName ? ` ยป ${otherName}` : "") + (premium ? " $" : "");
					} else {
						str += "\n" + (hits[name] ? "โ" : "โ") + ` /${name}`;
					}
				}
			}
			str += "\nโ\nโโโโโโโโโโโโโโโโ";
		}
		return context.reply({
			text: str,
		});
	},
	metadata: {
		__filename,
		command: ["menu"],
		permission: "all",
		category: "botsettings",
		locale: {
			description: {
				id: "[TODO] menu description",
				en: "[TODO] menu description",
			},
		},
	},
});
