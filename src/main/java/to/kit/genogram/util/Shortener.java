package to.kit.genogram.util;

import java.lang.reflect.Field;
import java.util.List;

import javax.persistence.Column;

/**
 * 切り詰め(バイト数).
 * @author H.Sasai
 */
public class Shortener {
	private static Object getObject(Object pojo, Field field) {
		Object obj = null;
		try {
			field.setAccessible(true);
			obj = field.get(pojo);
		} catch (@SuppressWarnings("unused") IllegalArgumentException | IllegalAccessException e) {
			// nop
		}
		return obj;
	}

	private static String getText(Object pojo, Field field) {
		return (String) getObject(pojo, field);
	}

	private static void setText(Object pojo, Field field, String text) {
		field.setAccessible(true);
		try {
			field.set(pojo, text);
		} catch (@SuppressWarnings("unused") IllegalArgumentException | IllegalAccessException e) {
			// nop
		}
	}

	private static String left(String text, int len) {
		StringBuilder buff = new StringBuilder();
		int currentLen = 0;

		for (char ch : text.toCharArray()) {
			int bytes = Character.toString(ch).getBytes().length; // あまりいい感じがしない

			if (len < currentLen + bytes) {
				break;
			}
			currentLen += bytes;
			buff.append(ch);
		}
		return buff.toString();
	}

	/**
	 * 切り詰める.
	 * @param list リスト
	 */
	public static void shorten(List<Object> list) {
		for (Object pojo : list) {
			shorten(pojo);
		}
	}

	/**
	 * 切り詰める.
	 * @param pojo POJO
	 */
	@SuppressWarnings("unchecked")
	public static void shorten(Object pojo) {
		Class<?> clazz = pojo.getClass();

		for (Field field : clazz.getDeclaredFields()) {
			Class<?> type = field.getType();

			if (type.isPrimitive() || type.isEnum()) {
				continue;
			}
			if (type != String.class) {
				Object obj = getObject(pojo, field);

				if (type == List.class) {
					shorten((List<Object>) obj);
				} else if (obj != null) {
					shorten(obj);
				}
				continue;
			}
			Column column = field.getAnnotation(Column.class);

			if (column == null) {
				continue;
			}
			String text = getText(pojo, field);

			if (text == null) {
				continue;
			}
			int maxLen = column.length();
			int len = text.getBytes().length;

			if (len < maxLen) {
				continue;
			}
			setText(pojo, field, left(text, maxLen));
		}
	}
}
